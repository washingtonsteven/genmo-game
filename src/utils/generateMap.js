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

const getMapNode = (map, pid) =>
  Boolean(map.find((n) => n.passage.pid === pid));

const mapContainsPid = (map, pid) => Boolean(getMapNode);

const getMapStart = (map) => map.find((n) => n.gridX === 0 && n.gridY === 0);

const iterateForMap = (
  startingPassage,
  currentPassage,
  prevGridCoords = { x: 0, y: 0 },
  fromPosition = { x: 0, y: 0 },
  map = []
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

  map = map.concat(new MapNode(currentPassage, to.x, to.y));

  const isBoundary =
    genmo.getPassage(currentPassage).region_boundary &&
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

const iterateForLines = (map, currentNode, fromNode, lines = []) => {
  currentNode = getMapNode(map, currentNode.pid || currentNode);
  if (!currentNode) return;
  if (fromNode) lines = lines.concat(new LineNode(fromNode, currentNode));

  currentNode.passage.links.forEach((link) => {
    const linkNode = getMapNode(map, link);
    if (!linkNode) return;
    const lineExists = Boolean(
      lines.find((line) => line.hasNodes(currentNode, linkNode))
    );
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
