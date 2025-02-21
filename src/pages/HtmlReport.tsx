import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Calculation } from '../types/calculation';
import { useTranslation } from 'react-i18next';

/**
 * @file HtmlReport.tsx
 *
 * @description This file contains the `HtmlReport` component, which displays the calculation results in a printable HTML format.
 * It receives the calculation data from the previous page via `location.state`.
 *
 * @module HtmlReport
 */

/**
 * HtmlReport component - displays the calculation results in a printable HTML format.
 *
 * @returns {React.ReactElement} The HtmlReport component.
 */
export const HtmlReportPage = () => {
  // Access the location object to get the calculation data from the previous page
  const location = useLocation();
  // Access the navigate function for navigation
  const navigate = useNavigate();
  // Extract the calculation data from the location state
  const calculation = (location.state as { calculation: Calculation })?.calculation;
  const { t } = useTranslation();

  // If there's no calculation data, redirect to the home page
  if (!calculation) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('htmlReport.back')}</span>
          </button>
        </div>

        {/* Report content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
              {t('htmlReport.title')}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                  {t('htmlReport.projectDetails')}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.projectName')}:</span>{' '}
                  {calculation.projectName}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.location')}:</span>{' '}
                  {calculation.projectLocation}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.date')}:</span>{' '}
                  {new Date(calculation.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                  {t('htmlReport.calculationResults')}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.totalLoad')}:</span>{' '}
                  {calculation.totalLoad}T
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.boomAngle')}:</span>{' '}
                  {calculation.boomAngle}°
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.minBoomLength')}:</span>{' '}
                  {calculation.minBoomLength}m
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.buildingHeight')}:</span>{' '}
                  {calculation.buildingHeight}m
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.craneDistance')}:</span>{' '}
                  {calculation.craneEdgeDistance}m
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{t('htmlReport.liftRadius')}:</span>{' '}
                  {calculation.liftRadius}m
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                {t('htmlReport.selectedCranes')}
              </h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                {calculation.selectedCranes.map((crane) => (
                  <li key={crane}>{crane}</li>
                ))}
              </ul>
            </div>

            {calculation.images && calculation.images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                  {t('htmlReport.photos')}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {calculation.images.map((image) => (
                    <div key={image.id}>
                      <img
                        src={image.url}
                        alt={image.caption || 'Project related image'}
                        className="w-full h-auto rounded-lg"
                      />
                      {image.caption && (
                        <p className="text-center text-gray-700 dark:text-gray-300 mt-2">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300">
                {t('htmlReport.generatedBy')} NPCrane.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
