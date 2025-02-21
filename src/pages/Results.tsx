import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Construction, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CraneOperationDiagram } from '../components/charts/CraneOperationDiagram';

interface ResultCardProps {
  label: string;
  value: number;
  unit: string;
}

const ResultCard = ({ label, value, unit }: ResultCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200"
  >
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    <div className="text-xl font-semibold mt-1 dark:text-white">
      {value} {unit}
    </div>
  </motion.div>
);

export const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const results = location.state?.results;

  if (!currentUser?.emailVerified || !results) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('calculator.back')}</span>
          </button>
          <div className="flex items-center gap-2 text-white">
            <Construction className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t('calculator.results')}</h1>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <ResultCard 
            label={t('calculator.totalLoad')} 
            value={results.totalLoad} 
            unit={t('units.tons')} 
          />
          <ResultCard 
            label={t('calculator.boomAngle')} 
            value={results.boomAngle} 
            unit={t('units.degrees')} 
          />
          <ResultCard 
            label={t('calculator.liftRadius')} 
            value={results.liftRadius} 
            unit={t('units.meters')} 
          />
          <ResultCard 
            label={t('calculator.minBoomLength')} 
            value={results.minBoomLength} 
            unit={t('units.meters')} 
          />
          <ResultCard 
            label={t('calculator.minVerticalHeight')} 
            value={results.minVerticalHeight} 
            unit={t('units.meters')} 
          />
        </motion.div>

        <CraneOperationDiagram data={results} />

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/crane-selection', { state: { results } })}
            className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
          >
            {t('craneSelection.title')}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
