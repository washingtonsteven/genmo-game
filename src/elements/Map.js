import React, { Fragment, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage } from "react-konva";
import { generateMap } from "../utils/generateMap";

const Map = ({ map, lines }) => {
  const [focusedNode, setFocusedNode] = useState(map[0]);
  const [started, setStarted] = useState(false);
  const stageRef = useRef();

  const stageSize = { width: 500, height: 500 };
  const stageScale = {
    x: containerSize.width / stageSize.width,
    y: containerSize.height / stageSize.height,
  };
  const nodeSize = {
    width: 50,
    height: 50,
  };
  const gridToPos = (node, offset) => ({
    x: node.gridX * nodeSize.width + node.gridX * (nodeSize.width / 2) + offset,
    y:
      node.gridY * nodeSize.height +
      node.gridX * (nodeSize.height / 2) +
      offset,
  });
  const focusNode = (node) => {
    const pos = gridToPos(node);
    pos.x += nodeSize.width / 2;
    pos.y += nodeSize.height / 2;
    return {
      x: -stageSize.width / 2 + pos.x,
      y: -stageSize.height / 2 + pos.y,
    };
  };

  const resetStage = () => {
    if (!stageRef.current) return;
    const offset = focusNode(focusedNode);
    if (started) {
      stageRef.current.to({
        x: 0,
        y: 0,
        offsetX: offset.x,
        offsetY: offset.y,
        duration: 0.2,
      });
    } else {
      stageRef.current.position({ x: 0, y: 0 });
      stageRef.current.offset(offset);
      setStarted(true);
    }
  };

  useEffect(resetStage, [focusedNode, started]);
  return (
    <Fragment>
      <Stage
        {...stageSize}
        scale={stageScale}
        ref={stageRef}
        draggable
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      >
        <Layer>
          {lines.getLines().map((line) => {
            const startPos = gridToPos(line.start);
            const endPos = gridToPos(line.end);
            startPos.x += nodeSize.width / 2;
            startPos.y += nodeSize.height / 2;
            endPos.x += nodeSize.width / 2;
            endPos.y += nodeSize.height / 2;
            const strokeColor = "purple";
            return (
              <Line
                x={0}
                y={0}
                points={[startPos.x, startPos.y, endPos.x, endPos.y]}
                key={line.toString()}
                stroke={strokeColor}
              />
            );
          })}
        </Layer>
        <Layer>
          {map.getMapNodes().map((node) => {
            const pos = gridToPos(node);
            const fillColor = node === focusedNode ? "red" : "blue";
            return (
              <Rect
                {...pos}
                {...nodeSize}
                fill={fillColor}
                key={node.toString()}
                onClick={() => setFocusedNode(node)}
              />
            );
          })}
        </Layer>
      </Stage>
    </Fragment>
  );
};

export default ({ genmo, startingPassage }) => {
  const [mapState, setMapState] = useState({});
  const containerSize = { width: 250, height: 300 };

  useEffect(() => {
    setMapState(generateMap(genmo, startingPassage));
  }, [genmo, startingPassage]);

  return (
    <div style={{ ...containerSize }}>
      <Map {...mapState} />
    </div>
  );
};
