import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReportContentGenerator } from '../components/ReportContentGenerator'; // Updated import
import { Calculation } from '../types/calculation';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HtmlReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const calculation = (location.state as { calculation: Calculation })?.calculation;
  const { t } = useTranslation();

  if (!calculation) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('htmlReport.back')}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <ReportContentGenerator calculation={calculation} />
        </div>
      </div>
    </div>
  );
};
