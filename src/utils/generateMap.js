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
    this.map = map.contact(otherMap);
  }
  getMapNode(pid) {
    return this.map.find((node) => node.passage.pid === pid);
  }
  mapContains(pid) {
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
      n.passage.pid === this.start.passage.pid ||
      n.passage.pid === this.end.passage.pid
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
    return Boolean(lines.find((line) => line.hasNodes(nodeA, nodeB)));
  }
  getLines() {
    return this.lines;
  }
}

const iterateForMap = (
  startingPassage,
  currentPassage,
  prevGridCoords = { x: 0, y: 0 },
  fromPosition = { x: 0, y: 0 },
  map
) => {
  currentPassage = currentPassage || startingPassage;

  if (startingPassage.pid === currentPassage.pid) {
    from = currentPassage.position;
  }

  const to = { x: prevGridCoords.x, y: prevGridCoords.y };
  const xDiff = fromPosition.x - currentPassage.position.x;
  to.x += xDiff === 0 ? 0 : xDiff / Math.abs(xDiff);
  const yDiff = fromPosition.y - currentPassage.position.y;
  to.y += yDiff === 0 ? 0 : yDiff / Math.abs(yDiff);

  if (!map) map = new Map();
  map = map.addNode(new MapNode(currentPassage, to.x, to.y));

  const isBoundary =
    genmo.getPassageData(currentPassage).region_boundary &&
    currentPassage.pid !== startingPassage;

  if (!isBoundary) {
    currentPassage.links.forEach((link) => {
      if (mapContainsPid(map, link.pid)) return;
      map = iterateForMap(
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

const iterateForLines = (map, currentNode, fromNode, lines) => {
  currentNode = map.getMapNode(currentNode.pid || currentNode);
  if (!currentNode) return;
  if (!lines) lines = new LineList();
  if (fromNode) lines = lines.addLine(new LineNode(fromNode, currentNode));

  currentNode.passage.links.forEach((link) => {
    const linkNode = map.getMapNode(link);
    if (!linkNode) return;
    const lineExists = lines.lineExists(currentNode, linkNode);
    if (lineExists) return;
    lines = iterateForLines(map, link, currentNode, lines);
  });

  return lines;
};

export const generateMap = (genmo, startingPassage) => {
  const map = iterateForMap(genmo.getPassage(startingPassage));
  const lines = iterateForLines(map, getMapStart(map));

  return { map, lines };
};
