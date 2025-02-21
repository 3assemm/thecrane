import React, { useState } from 'react';
import { Table, Grid, FileSpreadsheet, Edit, Trash2 } from 'lucide-react';
import { LoadChartViewModal } from '../LoadChartViewModal';
import { MatrixViewModal } from '../MatrixViewModal';
import { EditCraneModal } from '../EditCraneModal';
import { LoadChartUploadModal } from '../LoadChartUploadModal';
import { formatDate } from '../../utils/formatting';
import toast from 'react-hot-toast';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface CraneData {
  craneId: string;
  manufacturer: string;
  model: string;
  capacity: number;
  specifications: {
    maxBoomLength: number;
  };
  updatedAt: string;
  createdBy: string;
}

interface CraneDataTableProps {
  cranes: CraneData[];
  onRefresh: () => Promise<void>;
}

export const CraneDataTable: React.FC<CraneDataTableProps> = ({ cranes, onRefresh }) => {
  const [viewingLoadChart, setViewingLoadChart] = useState<{
    craneId: string;
    model: string;
    loadChart: any[];
  } | null>(null);
  const [viewingMatrix, setViewingMatrix] = useState<{
    craneId: string;
    model: string;
    loadChart: any[];
  } | null>(null);
  const [editingCrane, setEditingCrane] = useState<CraneData | null>(null);
  const [uploadingLoadChart, setUploadingLoadChart] = useState<CraneData | null>(null);

  const handleDelete = async (craneId: string) => {
    if (!confirm('Are you sure you want to delete this crane?')) return;

    try {
      await deleteDoc(doc(db, 'models', craneId));
      await deleteDoc(doc(db, 'loadCharts', craneId));
      toast.success('Crane deleted successfully');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete crane');
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Manufacturer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Max Boom Length
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cranes.map((crane) => (
              <tr key={crane.craneId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {crane.manufacturer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {crane.model}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {crane.capacity}T
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {crane.specifications.maxBoomLength}m
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatDate(crane.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => setViewingLoadChart({ craneId: crane.craneId, model: crane.model, loadChart: [] })}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View as table"
                  >
                    <Table className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewingMatrix({ craneId: crane.craneId, model: crane.model, loadChart: [] })}
                    className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title="View as matrix"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setUploadingLoadChart(crane)}
                    className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    title="Upload load chart"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setEditingCrane(crane)}
                    className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(crane.craneId)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingLoadChart && (
        <LoadChartViewModal
          isOpen={true}
          onClose={() => setViewingLoadChart(null)}
          loadChart={viewingLoadChart.loadChart}
          craneModel={viewingLoadChart.model}
        />
      )}

      {viewingMatrix && (
        <MatrixViewModal
          isOpen={true}
          onClose={() => setViewingMatrix(null)}
          loadChart={viewingMatrix.loadChart}
          craneModel={viewingMatrix.model}
        />
      )}

      {editingCrane && (
        <EditCraneModal
          crane={editingCrane}
          isOpen={true}
          onClose={() => setEditingCrane(null)}
          onSuccess={onRefresh}
        />
      )}

      {uploadingLoadChart && (
        <LoadChartUploadModal
          isOpen={true}
          onClose={() => setUploadingLoadChart(null)}
          onSuccess={onRefresh}
          crane={uploadingLoadChart}
        />
      )}
    </>
  );
};
