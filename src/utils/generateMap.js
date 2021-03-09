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
  toString() {
    return `[MAPNODE-${this.passage.pid}] (${this.gridX}, ${this.gridY}) - ${this.passage.name}`;
  }
}

class Map {
  constructor() {
    this.map = [];
  }
  addNode(node) {
    this.map.push(node);
  }
  concatMap(otherMap) {
    this.map = this.map.contact(otherMap);
  }
  getMapNode(pid) {
    return this.map.find((node) => node.passage.pid === pid);
  }
  containsNode(pid) {
    return Boolean(this.getMapNode(pid));
  }
  getMapStart() {
    return this.map.find((node) => node.gridX === 0 && node.gridY === 0);
  }
  getMapNodes() {
    return this.map;
  }
}

class LineNode {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  containsNode(node) {
    return (
      node.passage.pid === this.start.passage.pid ||
      node.passage.pid === this.end.passage.pid
    );
  }
  hasNodes(...nodes) {
    let result = true;
    nodes.forEach((n) => {
      if (!n) return;
      if (!this.containsNode(n)) {
        result = false;
      }
    });
    return result;
  }
  toString() {
    return `[LINENODE-${this.start.passage.pid}>${this.end.passage.pid}]`;
  }
}

class LineList {
  constructor() {
    this.lines = [];
  }
  addLine(line) {
    this.lines.push(line);
  }
  lineExists(nodeA, nodeB) {
    return Boolean(this.lines.find((line) => line.hasNodes(nodeA, nodeB)));
  }
  getLines() {
    return this.lines;
  }
}

const iterateForMap = (
  genmo,
  startingPassage,
  currentPassage,
  prevGridCoords = { x: 0, y: 0 },
  fromPosition = { x: 0, y: 0 },
  map
) => {
  currentPassage = genmo.getPassage(currentPassage || startingPassage);
  const currentPassageData = genmo.getPassageData(currentPassage);

  if (currentPassageData.grid_parent) {
    currentPassage = genmo.getPassageByName(currentPassageData.grid_parent);
  }

  if (!currentPassage || (map && map.containsNode(currentPassage.pid)))
    return map;

  if (startingPassage.pid === currentPassage.pid) {
    fromPosition = currentPassage.position;
  }

  const to = { x: prevGridCoords.x, y: prevGridCoords.y };
  const xDiff = currentPassage.position.x - fromPosition.x;
  to.x += xDiff === 0 ? 0 : xDiff / Math.abs(xDiff);
  const yDiff = currentPassage.position.y - fromPosition.y;
  to.y += yDiff === 0 ? 0 : yDiff / Math.abs(yDiff);

  if (!map) map = new Map();
  map.addNode(new MapNode(currentPassage, to.x, to.y));

  const isBoundary =
    currentPassageData.region_boundary &&
    currentPassage.pid !== startingPassage.pid;

  if (!isBoundary) {
    currentPassage.links.forEach((link) => {
      if (map.containsNode(link.pid)) return;
      map = iterateForMap(
        genmo,
        startingPassage,
        genmo.getPassage(link.pid),
        to,
        currentPassage.position,
        map
      );
    });
  }
  return map;
};

const iterateForLines = (genmo, map, currentNode, fromNode, lines) => {
  currentNode = map.getMapNode(
    currentNode.passage ? currentNode.passage.pid : currentNode.pid
  );
  if (!currentNode) return;
  const passageData = genmo.getPassageData(currentNode);
  if (passageData.grid_parent) {
    currentNode = map.getMapNode(
      genmo.getPassageByName(passageData.grid_parent)
    );
  }
  if (!lines) lines = new LineList();
  if (fromNode) lines.addLine(new LineNode(fromNode, currentNode));

  currentNode.passage.links.forEach((link) => {
    const linkNode = map.getMapNode(link.pid);
    if (!linkNode) return;
    const lineExists = lines.lineExists(currentNode, linkNode);
    if (lineExists) return;
    lines = iterateForLines(genmo, map, link, currentNode, lines);
  });
  return lines;
};

export const generateMap = (genmo, startingPassage) => {
  const map = iterateForMap(genmo, genmo.getPassage(startingPassage));
  const lines = iterateForLines(genmo, map, map.getMapStart());

  return { map, lines };
};
