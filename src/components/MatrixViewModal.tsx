import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { LoadChartPoint } from '../lib/firebase';

interface MatrixViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  loadChart: LoadChartPoint[];
  craneModel: string;
}

export const MatrixViewModal: React.FC<MatrixViewModalProps> = ({
  isOpen,
  onClose,
  loadChart,
  craneModel
}) => {
  if (!isOpen) return null;

  // Get unique radius and boom length values
  const radiusValues = [...new Set(loadChart.map(point => point.radius))].sort((a, b) => a - b);
  const boomLengthValues = [...new Set(loadChart.map(point => point.boomLength))].sort((a, b) => a - b);

  // Create matrix data structure
  const matrix: { [key: string]: number } = {};
  loadChart.forEach(point => {
    matrix[`${point.radius}-${point.boomLength}`] = point.capacity;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-[90vw] my-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 pr-8 dark:text-white">
          Load Chart Matrix - {craneModel}
        </h2>

        <div className="max-h-[calc(100vh-12rem)] overflow-auto">
          <table className="min-w-max divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 bg-white dark:bg-gray-800">
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
                  <td className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                    {radius}m
                  </td>
                  {boomLengthValues.map(boomLength => {
                    const capacity = matrix[`${radius}-${boomLength}`];
                    return (
                      <td 
                        key={boomLength}
                        className={`px-4 py-2 text-sm text-center ${
                          capacity
                            ? 'text-gray-900 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800'
                        }`}
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
      </motion.div>
    </div>
  );
};
