import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/formatting';

interface EditModeHeaderProps {
  calculationId?: string;
  createdAt?: string;
  title?: string;
  subtitle?: string;
  backButtonLabel?: string;
}

export const EditModeHeader: React.FC<EditModeHeaderProps> = ({
  calculationId = 'N/A',
  createdAt = '',
  title,
  subtitle,
  backButtonLabel,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Default title and subtitle
  const headerTitle = title || `${t('editModeHeader.title')} #${calculationId}`;
  const headerSubtitle = subtitle || `${t('editModeHeader.createdAt')}: ${formatDate(createdAt)}`;

  return (
    <div className="bg-yellow-50 border-b border-yellow-100 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-yellow-800">{headerTitle}</h1>
          <p className="text-sm text-yellow-600">{headerSubtitle}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{backButtonLabel || t('editModeHeader.backToDashboard')}</span>
        </motion.button>
      </div>
    </div>
  );
};
