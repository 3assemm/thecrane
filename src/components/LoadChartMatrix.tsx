import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCraneData } from '../hooks/useCraneData';

interface LoadChartMatrixProps {
  craneId: string;
  calculationResults: {
    totalLoad: number;
    minBoomLength: number;
    liftRadius: number;
  };
}

export const LoadChartMatrix: React.FC<LoadChartMatrixProps> = ({
  craneId,
  calculationResults
}) => {
  const { loadChart, loading, error } = useCraneData(craneId);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <Clock className="w-6 h-6 animate-spin text-yellow-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !loadChart) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <p className="text-red-500 dark:text-red-400">Failed to load chart data for {craneId}</p>
      </div>
    );
  }

  // Get unique radius and boom length values
  const radiusValues = [...new Set(loadChart.points.map(point => point.radius))].sort((a, b) => a - b);
  const boomLengthValues = [...new Set(loadChart.points.map(point => point.boomLength))].sort((a, b) => a - b);

  // Create matrix data structure
  const matrix: { [key: string]: number } = {};
  loadChart.points.forEach(point => {
    matrix[`${point.radius}-${point.boomLength}`] = point.capacity;
  });

  // Function to check if a cell should be evaluated
  const shouldEvaluateCell = (boomLength: number, radius: number) => {
    return boomLength >= calculationResults.minBoomLength && radius >= calculationResults.liftRadius;
  };

  // Function to check if capacity meets requirements
  const isSufficientCapacity = (capacity: number | undefined) => {
    return capacity !== undefined && capacity >= calculationResults.totalLoad;
  };

  // Function to get cell color class
  const getCellColorClass = (capacity: number | undefined, boomLength: number, radius: number) => {
    if (!shouldEvaluateCell(boomLength, radius)) {
      return 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800';
    }
    
    if (capacity === undefined) {
      return 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800';
    }

    // Special highlighting for exact lift radius that meets capacity
    if (radius === calculationResults.liftRadius && isSufficientCapacity(capacity)) {
      return 'text-gray-900 dark:text-gray-300 bg-green-200 dark:bg-green-800/40 font-bold';
    }

    return isSufficientCapacity(capacity)
      ? 'text-gray-900 dark:text-gray-300 bg-green-50 dark:bg-green-900/20'
      : 'text-gray-900 dark:text-gray-300 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        {loadChart.manufacturer} {loadChart.model}
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                Radius ↓ / Boom →
              </th>
              {boomLengthValues.map(boomLength => (
                <th 
                  key={boomLength}
                  className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700"
                >
                  {boomLength}m
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {radiusValues.map(radius => (
              <tr key={radius}>
                <td className={`px-4 py-2 text-sm font-medium ${
                  radius === calculationResults.liftRadius 
                    ? 'text-green-600 dark:text-green-400 font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                } bg-gray-50 dark:bg-gray-700`}>
                  {radius}m
                </td>
                {boomLengthValues.map(boomLength => {
                  const capacity = matrix[`${radius}-${boomLength}`];
                  const colorClass = getCellColorClass(capacity, boomLength, radius);
                  
                  return (
                    <td 
                      key={boomLength}
                      className={`px-4 py-2 text-sm text-center ${colorClass}`}
                    >
                      {capacity ? `${capacity}T` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Required: {calculationResults.totalLoad}T at {calculationResults.liftRadius}m radius with min. {calculationResults.minBoomLength}m boom</p>
      </div>
    </motion.div>
  );
};
