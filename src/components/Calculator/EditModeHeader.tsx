import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/formatting';

/**
 * @file EditModeHeader.tsx
 *
 * @description This file contains the `EditModeHeader` component, which is used in the `EditCalculation` page.
 * It displays the calculation ID and creation date, and provides a button to navigate back to the dashboard.
 *
 * @module EditModeHeader
 */

/**
 * Header component for edit mode.
 * Displays the calculation ID and creation date, and provides a button to navigate back to the dashboard.
 *
 * @param {object} props - The component props.
 * @param {string} props.calculationId - The ID of the calculation being edited.
 * @param {string} props.createdAt - The creation date of the calculation.
 * @returns {React.ReactElement} The EditModeHeader component.
 */
export const EditModeHeader: React.FC<{ calculationId: string; createdAt: string }> = ({ calculationId, createdAt }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-yellow-50 border-b border-yellow-100 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          {/* Display the calculation ID and creation date */}
          <h1 className="text-xl font-bold text-yellow-800">
            {t('editModeHeader.title')} #{calculationId}
          </h1>
          <p className="text-sm text-yellow-600">
            {t('editModeHeader.createdAt')}: {formatDate(createdAt)}
          </p>
        </div>
        {/* Button to navigate back to the dashboard */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('editModeHeader.backToDashboard')}</span>
        </motion.button>
      </div>
    </div>
  );
};
