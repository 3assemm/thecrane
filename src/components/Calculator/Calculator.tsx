import React, { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { calculateBoomAngle, calculateMinBoomLength, calculateTotalLoad, calculateVerticalHeight } from '../../utils/calculations';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * @file Calculator.tsx
 *
 * @description This file contains the `Calculator` component, which is the main component for the crane calculator application.
 * It allows users to input various parameters related to a lift operation and calculates the required boom angle,
 * minimum boom length, vertical height, and total load. It also provides functionality for file upload and printing.
 *
 * @module Calculator
 */

// Interface for the form data
interface FormData {
  loadWeight: string;
  liftHeight: string;
  liftRadius: string;
  craneToObstruction: string;
  selectedCrane: string;
  selectedUnit: string;
}

/**
 * Calculator component for crane operations.
 * Allows users to input various parameters and calculates the required boom angle,
 * minimum boom length, vertical height, and total load. It also provides functionality for file upload and printing.
 *
 * @returns {React.ReactElement} The Calculator component.
 */
export const Calculator: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    loadWeight: '',
    liftHeight: '',
    liftRadius: '',
    craneToObstruction: '',
    selectedCrane: '',
    selectedUnit: 'metric',
  });

  // State for calculation results
  const [results, setResults] = useState({
    boomAngle: 0,
    minBoomLength: 0,
    verticalHeight: 0,
    totalLoad: 0,
  });

  /**
   * Handles changes to form input fields.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles changes to the unit selection.
   *
   * @param {ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, selectedUnit: e.target.value });
  };

  /**
   * Handles changes to the crane selection.
   *
   * @param {ChangeEvent<HTMLSelectElement>} e - The change event.
   */
  const handleCraneChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, selectedCrane: e.target.value });
  };

  /**
   * Handles form submission, performs calculations, and updates results.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error(t('calculator.login_required'));
      return;
    }
    if (!currentUser.emailVerified) {
      toast.error(t('calculator.verification_required'));
      return;
    }

    // Parse form data as numbers
    const loadWeight = parseFloat(formData.loadWeight);
    const liftHeight = parseFloat(formData.liftHeight);
    const liftRadius = parseFloat(formData.liftRadius);
    const craneToObstruction = parseFloat(formData.craneToObstruction);

    // Perform calculations
    const boomAngle = calculateBoomAngle(liftHeight, liftRadius);
    const minBoomLength = calculateMinBoomLength(liftRadius, boomAngle);
    const verticalHeight = calculateVerticalHeight(minBoomLength, boomAngle);
    const totalLoad = calculateTotalLoad(loadWeight, 0); // Assuming liftTackle is 0 for now

    // Update results state
    setResults({ boomAngle, minBoomLength, verticalHeight, totalLoad });
  };

  /**
   * Handles file upload. Currently, it logs the file content to the console.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        console.log("File content:", text);
        // Here you would typically parse the file and update the state
        // Since we cannot use 'curses' or 'pip', we will simulate updating the state
        toast.success("File processed. Check console for content.");
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        toast.error("Error reading file");
      };
      reader.readAsText(file);
    } else {
      toast.error("No file selected");
    }
  };

  /**
   * Handles the print action, triggering the browser's print functionality.
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-4">{t('calculator.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">
            {t('calculator.load_weight')} ({formData.selectedUnit === 'metric' ? 't' : 'lbs'}):
            <input
              type="number"
              name="loadWeight"
              value={formData.loadWeight}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            {t('calculator.lift_height')} ({formData.selectedUnit === 'metric' ? 'm' : 'ft'}):
            <input
              type="number"
              name="liftHeight"
              value={formData.liftHeight}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            {t('calculator.lift_radius')} ({formData.selectedUnit === 'metric' ? 'm' : 'ft'}):
            <input
              type="number"
              name="liftRadius"
              value={formData.liftRadius}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            {t('calculator.crane_distance')} ({formData.selectedUnit === 'metric' ? 'm' : 'ft'}):
            <input
              type="number"
              name="craneToObstruction"
              value={formData.craneToObstruction}
              onChange={handleInputChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            {t('calculator.select_crane')}:
            <select
              name="selectedCrane"
              value={formData.selectedCrane}
              onChange={handleCraneChange}
              className="mt-1 block w-full"
            >
              <option value="">{t('calculator.select_crane')}</option>
              {/* Add your crane options here */}
            </select>
          </label>
        </div>
        <div>
          <label className="block mb-2">
            {t('calculator.select_unit')}:
            <select
              name="selectedUnit"
              value={formData.selectedUnit}
              onChange={handleUnitChange}
              className="mt-1 block w-full"
            >
              <option value="metric">{t('calculator.metric')}</option>
              <option value="imperial">{t('calculator.imperial')}</option>
            </select>
          </label>
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {t('calculator.calculate')}
          </button>
          <button type="button" onClick={() => navigate('/results')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {t('calculator.results')}
          </button>
          <button type="button" onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            {t('calculator.upload')}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button type="button" onClick={handlePrint} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
            {t('calculator.print')}
          </button>
        </div>
      </form>

      {/* Results Display */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">{t('calculator.results')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-700 dark:text-gray-300">{t('calculator.boom_angle')}:</p>
            <p className="text-lg font-semibold">{results.boomAngle}°</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">{t('calculator.min_boom_length')}:</p>
            <p className="text-lg font-semibold">{results.minBoomLength}m</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">{t('calculator.vertical_height')}:</p>
            <p className="text-lg font-semibold">{results.verticalHeight}m</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">{t('calculator.total_load')}:</p>
            <p className="text-lg font-semibold">{results.totalLoad}t</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
