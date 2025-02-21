import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, ArrowLeft, Clock, X } from 'lucide-react';
import { findSuitableCranes, type CraneModel } from '../lib/firebase';
import toast from 'react-hot-toast';

/**
 * `CraneSelection` Component
 *
 * Purpose:
 * This component allows users to select one or more cranes suitable for a project based on
 * the calculation results obtained from the `Calculator` component. It fetches and displays
 * a list of cranes from Firestore, filtered by the project's requirements, and allows users
 * to select the cranes they want to use.
 *
 * Usage:
 * This component is used as a page in the application, typically navigated to after the user
 * has entered project details in the `Calculator` component and clicked the "Next" button.
 * The page receives the calculation results through the `location.state` object.
 *
 * Functionality:
 * - Fetches a list of suitable cranes from Firestore based on the calculation results using `findSuitableCranes`.
 * - Displays the list of cranes, grouped by manufacturer, with checkboxes for selection.
 * - Allows users to select multiple cranes.
 * - Provides "Select All" and "Clear All" functionality for each manufacturer.
 * - Provides a "Select All" and "Clear All" functionality for all cranes.
 * - Navigates to the next step (`LoadChartComparison`) when the user clicks the "Next" button,
 *   passing the selected cranes and calculation results in the `location.state`.
 * - Displays loading and error states appropriately.
 * - Uses `react-router-dom` for navigation.
 * - Uses `react-i18next` for internationalization.
 * - Uses `framer-motion` for animations.
 * - Uses `react-hot-toast` for notifications.
 *
 * @returns {React.ReactElement} The `CraneSelection` component.
 */
export const CraneSelection = () => {
  // Access the location object to get the calculation results from the previous step
  const location = useLocation();
  // Access the navigate function for navigation
  const navigate = useNavigate();
  // Access the translation function for internationalization
  const { t } = useTranslation();
  // State for managing the list of selected crane IDs
  const [selectedCranes, setSelectedCranes] = useState<string[]>([]);
  // State for storing the list of suitable cranes fetched from Firestore
  const [suitableCranes, setSuitableCranes] = useState<CraneModel[]>([]);
  // State for managing the loading state
  const [loading, setLoading] = useState(true);
  // Extract calculation results from the location state
  const calculationResults = location.state?.results;

  useEffect(() => {
    // Fetch suitable cranes from Firestore based on calculation results
    const fetchSuitableCranes = async () => {
      if (!calculationResults) {
        navigate('/');
        return;
      }

      try {
        const cranes = await findSuitableCranes(
          calculationResults.totalLoad,
          calculationResults.liftRadius,
          calculationResults.minBoomLength
        );
        setSuitableCranes(cranes);
      } catch (error) {
        toast.error('Failed to fetch suitable cranes');
      } finally {
        setLoading(false);
      }
    };

    fetchSuitableCranes();
  }, [calculationResults, navigate]);

  /**
   * Toggles the selection of all cranes for a specific manufacturer.
   *
   * @param {string} manufacturer - The manufacturer for which to toggle crane selection.
   */
  const handleToggleAll = (manufacturer: string) => {
    const manufacturerCranes = suitableCranes
      .filter(crane => crane.manufacturer === manufacturer)
      .map(crane => crane.craneId);
    
    const allSelected = manufacturerCranes.every(id => selectedCranes.includes(id));
    
    if (allSelected) {
      setSelectedCranes(prev => prev.filter(id => !manufacturerCranes.includes(id)));
    } else {
      setSelectedCranes(prev => [...prev, ...manufacturerCranes]);
    }
  };

  /**
   * Toggles the selection of all cranes.
   */
  const handleToggleAllCranes = () => {
    const allCraneIds = suitableCranes.map(crane => crane.craneId);
    const allSelected = allCraneIds.every(id => selectedCranes.includes(id));
    
    if (allSelected) {
      setSelectedCranes([]);
    } else {
      setSelectedCranes(allCraneIds);
    }
  };

  /**
   * Toggles the selection of a single crane.
   *
   * @param {string} craneId - The ID of the crane to toggle.
   */
  const handleSelectCrane = (craneId: string) => {
    setSelectedCranes(prev => 
      prev.includes(craneId)
        ? prev.filter(id => id !== craneId)
        : [...prev, craneId]
    );
  };

  /**
   * Handles the "Next" button click, navigating to the LoadChartComparison page.
   */
  const handleNext = () => {
    if (selectedCranes.length === 0) {
      toast.error('Please select at least one crane');
      return;
    }
    
    navigate('/load-chart-comparison', { 
      state: { 
        selectedCranes,
        calculationResults 
      }
    });
  };

  // Group cranes by manufacturer
  const groupedCranes = suitableCranes.reduce<Record<string, CraneModel[]>>((acc, crane) => {
    if (!acc[crane.manufacturer]) {
      acc[crane.manufacturer] = [];
    }
    acc[crane.manufacturer].push(crane);
    return acc;
  }, {});

  // Check if all cranes are selected
  const allCranesSelected = suitableCranes.length > 0 && 
    suitableCranes.every(crane => selectedCranes.includes(crane.craneId));

  if (!calculationResults) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {/* Back button */}
          <button
            onClick={() => navigate('/results', { state: { results: calculationResults } })}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>{t('calculator.backToResults')}</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">
              {t('craneSelection.title')}
            </h2>
            {suitableCranes.length > 0 && (
              <button
                onClick={handleToggleAllCranes}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              >
                {allCranesSelected ? (
                  <>
                    <X className="w-5 h-5" />
                    Clear All
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Select All
                  </>
                )}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="w-6 h-6 animate-spin text-yellow-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          ) : suitableCranes.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No suitable cranes found for your requirements
            </p>
          ) : (
            Object.entries(groupedCranes).map(([manufacturer, cranes]) => (
              <div key={manufacturer} className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold dark:text-white">{manufacturer}</h3>
                  <button
                    onClick={() => handleToggleAll(manufacturer)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-2"
                  >
                    {cranes.every(crane => selectedCranes.includes(crane.craneId)) ? (
                      <>
                        <X className="w-4 h-4" />
                        Clear All
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Select All
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cranes.map(crane => (
                    <motion.div
                      key={crane.craneId}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold dark:text-white">{crane.model}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {crane.capacity}T • {crane.specifications.maxBoomLength}m
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Max Radius: {crane.specifications.maxRadius}m
                          </p>
                        </div>
                        <button
                          onClick={() => handleSelectCrane(crane.craneId)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                            selectedCranes.includes(crane.craneId)
                              ? 'bg-yellow-400 text-black'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          {selectedCranes.includes(crane.craneId) && <Check className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}

          {suitableCranes.length > 0 && (
            <div className="mt-8 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={selectedCranes.length === 0}
                className="bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
              >
                {t('calculator.next')}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
