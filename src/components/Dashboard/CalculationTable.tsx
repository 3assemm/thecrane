import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, FileDown, Printer, QrCode } from 'lucide-react';
import { Calculation } from '../../types/calculation';
import { formatDate } from '../../utils/formatting';
import { downloadQRCode } from '../../utils/qrCodeHelpers';

// Interface for the CalculationTable component props
interface CalculationTableProps {
  calculations: Calculation[];
  handleDelete: (id: string) => void; // Add handleDelete to props
  handleDownload: (calculation: Calculation) => void;
  handlePrint: (calculation: Calculation) => void;
}

/**
 * CalculationTable component - displays a table of calculations with options to view, edit, delete, download, and print.
 *
 * @param {CalculationTableProps} props - The component props.
 * @param {Calculation[]} props.calculations - The array of calculations to display.
 * @param {(id: string) => void} props.handleDelete - The function to call when a calculation is deleted.
 * @returns {React.ReactElement} The CalculationTable component.
 */
export const CalculationTable: React.FC<CalculationTableProps> = ({
  calculations,
  handleDelete,
  handleDownload,
  handlePrint
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              QR Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Project Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total Load
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Min Boom Length
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Boom Angle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Selected Cranes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {calculations.map((calculation) => (
            <tr key={calculation.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-4">
                  {/* View button */}
                  <button
                    onClick={() => navigate('/html-report', { state: { calculation } })}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Report"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {/* Edit button */}
                  <button
                    onClick={() => navigate(`/calculations/${calculation.id}/edit`)}
                    className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(calculation)}
                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title="Download PDF"
                  >
                    <FileDown className="w-5 h-5" />
                  </button>
                  {/* Print button */}
                  <button
                    onClick={() => handlePrint(calculation)}
                    className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    title="Print"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => calculation.id && handleDelete(calculation.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
              {/* Calculation ID */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {calculation.id}
              </td>
              {/* QR Code download button */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => calculation.id && downloadQRCode(calculation.id, `qrcode-${calculation.id}.png`)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Download QR Code"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </td>
              {/* Creation Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {formatDate(calculation.createdAt)}
              </td>
              {/* Project Name */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.projectName}
              </td>
              {/* Project Location */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.projectLocation}
              </td>
              {/* Total Load */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.totalLoad}t
              </td>
              {/* Minimum Boom Length */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.minBoomLength}m
              </td>
              {/* Boom Angle */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.boomAngle}°
              </td>
              {/* Selected Cranes */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                {calculation.selectedCranes.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
