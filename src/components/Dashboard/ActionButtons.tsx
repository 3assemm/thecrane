import React from 'react';
import { Eye, FileDown, Printer, Trash2, Calculator } from 'lucide-react';
import { Calculation } from '../../types/calculation';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  calculation: Calculation;
  onDownload: (calculation: Calculation) => void;
  onPrint: (calculation: Calculation) => void;
  onDelete: (id: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  calculation,
  onDownload,
  onPrint,
  onDelete
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/html-report', { state: { calculation } });
  };

  const handleEdit = () => {
    // Pass the entire calculation object in state
    navigate(`/calculations/${calculation.id}/edit`, { 
      state: { calculation }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleView}
        className="text-yellow-500 hover:text-yellow-700 transition-colors"
        title="View Report"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={handleEdit}
        className="text-blue-500 hover:text-blue-700 transition-colors"
        title="Edit Calculation"
      >
        <Calculator className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDownload(calculation)}
        className="text-green-500 hover:text-green-700 transition-colors"
        title="Download PDF"
      >
        <FileDown className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPrint(calculation)}
        className="text-purple-500 hover:text-purple-700 transition-colors"
        title="Print"
      >
        <Printer className="w-4 h-4" />
      </button>
      <button
        onClick={() => calculation.id && onDelete(calculation.id)}
        className="text-red-500 hover:text-red-700 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
