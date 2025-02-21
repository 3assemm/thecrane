import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, Weight, ArrowLeftRight, QrCode } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  type: 'height' | 'load' | 'radius';
}

export const InputField = ({ label, value, onChange, unit, type }: InputFieldProps) => {
  const getIcon = () => {
    switch (type) {
      case 'height':
        return <ArrowUpDown className="w-5 h-5 text-gray-400" />;
      case 'load':
        return <Weight className="w-5 h-5 text-gray-400" />;
      case 'radius':
        return <ArrowLeftRight className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {getIcon()}
        </div>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white pl-10 pr-20 py-2"
          step="0.1"
          inputMode="decimal"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md mr-2 transition-colors"
            title="Scan QR Code"
          >
            <QrCode className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-gray-500 dark:text-gray-400 pr-3">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
};
