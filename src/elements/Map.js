import { Genmo } from "@esaevian/genmo-v2";
import Engine from "../story/Engine.json";

// THIS IS THE DOOZY. TRYING TO FIGURE OUT HOW TO DRAW THIS ONE.

/**
 * Can use straightforward math on the positions to find a map. Based on region boundaries etc.
 * How do we draw this? SVG? Fancy divs?
 */

const genmo = new Genmo(Engine);
const getPassage = (pid) => {
  if (pid.pid) pid = pid.pid;
  return genmo.state.storyData.passages.find((p) => p.pid === pid);
};

class MapNode {
  constructor(passage, gridX = 0, gridY = 0) {
    this.passage = passage;
    this.setGridPosition(gridX, gridY);
  }
  setGridPosition(gridX, gridY) {
    if (gridX || gridX === 0) {
      this.gridX = gridX;
    }
    if (gridY || gridY === 0) {
      this.gridY = gridY;
    }
  }
}

MapNode.prototype.toString = function () {
  return `[${this.passage.pid}][${this.gridX} / ${this.gridY}] ${this.passage.name}`;
};

const createMap = (
  startingPassage,
  currentPassage,
  prevGrid = { x: 0, y: 0 },
  from = { x: 0, y: 0 },
  map = []
) => {
  currentPassage = getPassage(currentPassage || startingPassage);
  console.log("Mapping: " + currentPassage.name);

  if (startingPassage === currentPassage.pid) {
    from = currentPassage.position;
  }
  const to = { x: prevGrid.x, y: prevGrid.y };
  if (from.x > currentPassage.position.x) {
    to.x -= 1;
  }
  if (from.x < currentPassage.position.x) {
    to.x += 1;
  }
  if (from.y > currentPassage.position.y) {
    to.y -= 1;
  }
  if (from.y < currentPassage.position.y) {
    to.y += 1;
  }
  map = [...map, new MapNode(currentPassage, to.x, to.y)];

  const isBoundary =
    genmo.getPassageData(currentPassage).region_boundary &&
    currentPassage.pid !== startingPassage;

  if (!isBoundary) {
    currentPassage.links.forEach((link) => {
      // TODO: Only loop over valid links according to genmo, might need to add a `getPassageLinks` function?
      if (map.find((mapnode) => mapnode.passage.pid === link.pid)) return;
      const childMap = createMap(
        startingPassage,
        link.pid,
        to,
        currentPassage.position,
        map
      );
      map = childMap;
    });
  }

  return map;
};

class Line {
  constructor(start, end) {
    // MapNodes
    this.start = start;
    this.end = end;
  }
  hasNodes(...nodes) {
    let result = true;
    nodes.forEach((n) => {
      if (n) {
        if (
          !(
            n.passage.pid === this.start.passage.pid ||
            n.passage.pid === this.end.passage.pid
          )
        )
          result = false;
      }
    });
    return result;
  }
}

Line.prototype.toString = function () {
  return `Linking ${this.start.passage.name} to ${this.end.passage.name}: [${this.start.gridX} / ${this.start.gridY}] to [${this.end.gridX} / ${this.end.gridY}]`;
};

const getNode = (map, passage) => {
  const pid = passage.passage
    ? passage.passage.pid
    : passage.pid
    ? passage.pid
    : passage;
  return map.find((n) => n.passage.pid === pid);
};

const getLines = (map, currentNode, fromNode, lines = []) => {
  currentNode = getNode(map, currentNode);
  if (fromNode) lines = [...lines, new Line(fromNode, currentNode)];

  currentNode.passage.links.forEach((link) => {
    const linkNode = getNode(map, link);
    if (!linkNode) return;
    const lineExists = lines.find((line) =>
      line.hasNodes(currentNode, linkNode)
    );
    if (lineExists) {
      return;
    }
    const childLines = getLines(map, link, currentNode, lines);
    lines = childLines;
  });

  return lines;
};

const map = createMap("4");
map.forEach((n) => console.log(n.toString()));

const lines = getLines(
  map,
  map.find((n) => n.gridX === 0 && n.gridY === 0)
);
lines.forEach((l) => console.log(l.toString()));
