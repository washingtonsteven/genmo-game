import React, { Fragment, useEffect, useRef, useState } from "react";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import { generateMap } from "../utils/generateMap";

const nodeSize = {
  width: 50,
  height: 50,
};

const stageSize = { width: 600, height: 600 };

const gridToPos = (node, offset = 0) => ({
  x: node.gridX * nodeSize.width + node.gridX * (nodeSize.width / 2) + offset,
  y: node.gridY * nodeSize.height + node.gridY * (nodeSize.height / 2) + offset,
});

const focusNode = (node) => {
  if (!node) return { x: 0, y: 0 };
  const pos = gridToPos(node);
  pos.x += nodeSize.width / 2;
  pos.y += nodeSize.height / 2;
  return {
    x: -stageSize.width / 2 + pos.x,
    y: -stageSize.height / 2 + pos.y,
  };
};

const MapCanvas = ({ map, lines, containerSize, focusedNode }) => {
  const [started, setStarted] = useState(false);
  const stageRef = useRef();

  const stageScale = {
    x: containerSize.width / stageSize.width,
    y: containerSize.height / stageSize.height,
  };

  const resetStage = () => {
    if (!stageRef.current) return;
    const offset = focusNode(focusedNode);
    if (started && false) {
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
        {lines && (
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
        )}
        <Layer>
          {map.getMapNodes().map((node) => {
            const pos = gridToPos(node);
            const fillColor = node === focusedNode ? "red" : "blue";
            return (
              <Fragment key={node.toString()}>
                <Rect
                  {...pos}
                  {...nodeSize}
                  fill={fillColor}
                  key={node.toString()}
                />
                <Text
                  text={node.passage.pid}
                  {...pos}
                  fill="white"
                  fontStyle="bold"
                  fontSize={24}
                />
              </Fragment>
            );
          })}
        </Layer>
      </Stage>
    </Fragment>
  );
};

export const Map = ({ genmo, startingPassage, focusedNode }) => {
  const [mapState, setMapState] = useState({});
  const [focusedMapNode, setFocusedMapNode] = useState(null);
  const containerSize = { width: 300, height: 300 };

  useEffect(() => {
    if (startingPassage) setMapState(generateMap(genmo, startingPassage));
  }, [genmo, startingPassage]);

  useEffect(() => {
    const getMapNode = (node) => {
      if (!node || !mapState || !mapState.map) return;
      const passageData = genmo.getPassageData(node.passage);
      if (passageData.grid_parent) {
        node = (genmo.getPassageByName(passageData.grid_parent) || {}).pid;
      }
      const mapNode = mapState.map.getMapNode(node);
      return mapNode;
    };

    if (focusedNode && mapState && mapState.map) {
      setFocusedMapNode(getMapNode(focusedNode.pid));
    } else {
      setFocusedMapNode(null);
    }
  }, [mapState, focusedNode, genmo]);

  return (
    <div style={{ ...containerSize }}>
      {startingPassage && mapState.map && (
        <MapCanvas
          {...mapState}
          focusedNode={focusedMapNode}
          containerSize={containerSize}
        />
      )}
      {!startingPassage && <span>No map here.</span>}
    </div>
  );
};
