import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text } from 'react-konva';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface SiteLayoutDiagramProps {
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
}

export const SiteLayoutDiagram: React.FC<SiteLayoutDiagramProps> = ({
  width = 600,
  height = 400,
  onSave
}) => {
  const [cranePosition, setCranePosition] = useState<Point>({ x: 100, y: 200 });
  const [pickupPosition, setPickupPosition] = useState<Point>({ x: 200, y: 150 });
  const [setdownPosition, setSetdownPosition] = useState<Point>({ x: 300, y: 250 });
  const [obstacles, setObstacles] = useState<Point[]>([
    { x: 250, y: 200 },
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleDragMove = (e: any, type: string) => {
    const pos = { x: e.target.x(), y: e.target.y() };
    switch (type) {
      case 'crane':
        setCranePosition(pos);
        break;
      case 'pickup':
        setPickupPosition(pos);
        break;
      case 'setdown':
        setSetdownPosition(pos);
        break;
      default:
        if (type.startsWith('obstacle-')) {
          const index = parseInt(type.split('-')[1]);
          const newObstacles = [...obstacles];
          newObstacles[index] = pos;
          setObstacles(newObstacles);
        }
    }
  };

  const addObstacle = () => {
    setObstacles([...obstacles, { x: Math.random() * width * 0.8, y: Math.random() * height * 0.8 }]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Site Layout (Top View)</h3>
        <button
          onClick={addObstacle}
          className="px-3 py-1 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white rounded-lg text-sm"
        >
          Add Obstacle
        </button>
      </div>

      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <Stage width={width} height={height}>
          <Layer>
            {/* Grid */}
            {Array.from({ length: width / 50 }).map((_, i) => (
              <Line
                key={`vertical-${i}`}
                points={[i * 50, 0, i * 50, height]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: height / 50 }).map((_, i) => (
              <Line
                key={`horizontal-${i}`}
                points={[0, i * 50, width, i * 50]}
                stroke="#ddd"
                strokeWidth={1}
              />
            ))}

            {/* Crane */}
            <Circle
              x={cranePosition.x}
              y={cranePosition.y}
              radius={20}
              fill="#F59E0B"
              draggable
              onDragMove={(e) => handleDragMove(e, 'crane')}
              onClick={() => setSelectedElement('crane')}
            />
            <Text
              x={cranePosition.x - 20}
              y={cranePosition.y + 25}
              text="Crane"
              fontSize={12}
            />

            {/* Pickup Point */}
            <Rect
              x={pickupPosition.x - 15}
              y={pickupPosition.y - 15}
              width={30}
              height={30}
              fill="#10B981"
              draggable
              onDragMove={(e) => handleDragMove(e, 'pickup')}
              onClick={() => setSelectedElement('pickup')}
            />
            <Text
              x={pickupPosition.x - 25}
              y={pickupPosition.y + 20}
              text="Pick-up"
              fontSize={12}
            />

            {/* Set-down Point */}
            <Rect
              x={setdownPosition.x - 15}
              y={setdownPosition.y - 15}
              width={30}
              height={30}
              fill="#3B82F6"
              draggable
              onDragMove={(e) => handleDragMove(e, 'setdown')}
              onClick={() => setSelectedElement('setdown')}
            />
            <Text
              x={setdownPosition.x - 30}
              y={setdownPosition.y + 20}
              text="Set-down"
              fontSize={12}
            />

            {/* Obstacles */}
            {obstacles.map((obstacle, i) => (
              <React.Fragment key={`obstacle-${i}`}>
                <Rect
                  x={obstacle.x - 20}
                  y={obstacle.y - 20}
                  width={40}
                  height={40}
                  fill="#EF4444"
                  draggable
                  onDragMove={(e) => handleDragMove(e, `obstacle-${i}`)}
                  onClick={() => setSelectedElement(`obstacle-${i}`)}
                />
                <Text
                  x={obstacle.x - 30}
                  y={obstacle.y + 25}
                  text={`Obstacle ${i + 1}`}
                  fontSize={12}
                />
              </React.Fragment>
            ))}

            {/* Path Lines */}
            <Line
              points={[
                cranePosition.x,
                cranePosition.y,
                pickupPosition.x,
                pickupPosition.y,
                setdownPosition.x,
                setdownPosition.y,
              ]}
              stroke="#9CA3AF"
              strokeWidth={2}
              dash={[5, 5]}
            />
          </Layer>
        </Stage>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Drag elements to adjust positions. Grid spacing: 5m</p>
      </div>
    </motion.div>
  );
};
