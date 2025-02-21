import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CraneOperationDiagramProps {
  data: {
    buildingHeight: number;
    craneEdgeDistance: number;
    boomAngle: number;
    minBoomLength: number;
    liftRadius: number;
  };
}

export const CraneOperationDiagram: React.FC<CraneOperationDiagramProps> = ({ data }) => {
  // Calculate boom end point using lift radius and trigonometry
  const boomEndX = data.liftRadius;
  const boomEndY = Math.tan(data.boomAngle * Math.PI / 180) * boomEndX;

  // Format numbers to 1 decimal place with validation
  const formatNumber = (num: number) => {
    const value = Number(num.toFixed(1));
    return isNaN(value) ? 0 : value;
  };

  const formattedBoomEndX = formatNumber(boomEndX);
  const formattedBoomEndY = formatNumber(boomEndY);
  const formattedBoomLength = formatNumber(Math.sqrt(formattedBoomEndX ** 2 + formattedBoomEndY ** 2));

  // Calculate the maximum value for both axes to maintain equal scale
  const maxValue = Math.max(
    formattedBoomEndX,
    formattedBoomEndY,
    data.craneEdgeDistance,
    data.buildingHeight,
    1
  ) * 1.2; // Add 20% padding

  // Create dummy data points to ensure chart has valid data
  const chartData = [
    { x: 0, y: 0 },
    { x: formattedBoomEndX, y: formattedBoomEndY }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mt-8">
      <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center justify-between">
        <span>Crane Operation Diagram</span>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Scale: 1 unit = 1m
        </div>
      </h3>
      <div className="h-[600px] w-full mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <defs>
              <linearGradient id="boomGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number"
              dataKey="x"
              domain={[0, maxValue]}
              unit="m"
              tickFormatter={formatNumber}
              ticks={Array.from({ length: 6 }, (_, i) => (maxValue * i) / 5)}
              stroke="#6B7280"
            />
            <YAxis 
              type="number"
              dataKey="y"
              domain={[0, maxValue]}
              unit="m"
              tickFormatter={formatNumber}
              ticks={Array.from({ length: 6 }, (_, i) => (maxValue * i) / 5)}
              stroke="#6B7280"
            />
            <Tooltip 
              formatter={(value: number) => [formatNumber(value), 'm']}
              labelFormatter={(label) => `Distance: ${formatNumber(Number(label))}m`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            {/* Ground Level */}
            <ReferenceLine
              y={0}
              stroke="#4B5563"
              strokeWidth={2}
              label={{
                value: 'Ground Level',
                position: 'right',
                fill: '#4B5563'
              }}
            />

            {/* Crane Boom */}
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: formattedBoomEndX, y: formattedBoomEndY }]}
              stroke="url(#boomGradient)"
              strokeWidth={4}
              label={{
                value: `Boom (${formattedBoomLength}m)`,
                position: 'center',
                fill: '#F59E0B',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            />

            {/* Building/Obstruction */}
            <ReferenceLine
              segment={[
                { x: data.craneEdgeDistance, y: 0 },
                { x: data.craneEdgeDistance, y: data.buildingHeight }
              ]}
              stroke="#4B5563"
              strokeWidth={4}
              label={{
                value: 'Building Obstruction',
                position: 'right',
                fill: '#4B5563',
                fontSize: 14,
                fontWeight: 'bold'
              }}
            />

            {/* Boom End Measurements */}
            <ReferenceLine
              x={formattedBoomEndX}
              stroke="#9CA3AF"
              strokeDasharray="3 3"
              label={{
                value: `${formattedBoomEndX}m`,
                position: 'bottom',
                fill: '#4B5563',
                fontSize: 12
              }}
            />
            <ReferenceLine
              y={formattedBoomEndY}
              stroke="#9CA3AF"
              strokeDasharray="3 3"
              label={{
                value: `${formattedBoomEndY}m`,
                position: 'left',
                fill: '#4B5563',
                fontSize: 12
              }}
            />

            {/* Add a Line component to ensure chart renders */}
            <Line
              type="monotone"
              dataKey="y"
              stroke="transparent"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Boom Details</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Length: {formattedBoomLength}m</li>
            <li>Angle: {data.boomAngle}°</li>
            <li>Height: {formattedBoomEndY}m</li>
          </ul>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Building Details</h4>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>Height: {data.buildingHeight}m</li>
            <li>Distance: {data.craneEdgeDistance}m</li>
            <li>Lift Radius: {data.liftRadius}m</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
