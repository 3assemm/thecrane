import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalculatorIcon, RotateCcw, Mail } from 'lucide-react';
import { InputField } from './InputField';
import { ResultCard } from './ResultCard';
import { QrScanner } from './QrScanner';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// Global state to persist calculator values
let globalCalculatorState = {
  buildingHeight: 3,
  craneEdgeDistance: 5,
  liftRadius: 5,
  requiredLoad: 0.5,
  liftTackle: 0.5,
  totalLoad: 1,
  boomAngle: 0,
  minBoomLength: 0,
  minVerticalHeight: 0
};

export const CraneCalculator = () => {
  const { currentUser, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [values, setValues] = useState(globalCalculatorState);
  const [resending, setResending] = useState(false);

  // Update global state when local state changes
  useEffect(() => {
    globalCalculatorState = values;
  }, [values]);

  // Initialize from location state if available
  useEffect(() => {
    if (location.state?.results) {
      setValues(location.state.results);
      setShowResults(true);
    }
  }, [location.state]);

  const handleInputChange = (field: string, value: number) => {
    setValues(prev => {
      const newValues = {
        ...prev,
        [field]: value,
        totalLoad: field === 'requiredLoad' || field === 'liftTackle' 
          ? Number(value) + (field === 'requiredLoad' ? prev.liftTackle : prev.requiredLoad)
          : prev.totalLoad
      };
      globalCalculatorState = newValues;
      return newValues;
    });
  };

  const handleResendVerification = async () => {
    if (resending) return;
    
    setResending(true);
    try {
      await resendVerificationEmail();
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setResending(false);
    }
  };

  const handleReset = () => {
    const resetValues = {
      buildingHeight: 0,
      craneEdgeDistance: 0,
      liftRadius: 0,
      requiredLoad: 0,
      liftTackle: 0,
      totalLoad: 0,
      boomAngle: 0,
      minBoomLength: 0,
      minVerticalHeight: 0
    };
    setValues(resetValues);
    globalCalculatorState = resetValues;
    setShowResults(false);
  };

  const calculateCraneLift = () => {
    const { buildingHeight, craneEdgeDistance, liftRadius } = values;
    
    // Calculate minimum angle needed to clear the building
    const obstructionAngle = Math.atan2(buildingHeight, craneEdgeDistance) * (180 / Math.PI);
    
    // Calculate angle needed to reach the lift point
    const liftAngle = Math.atan2(buildingHeight, liftRadius) * (180 / Math.PI);
    
    // Use the larger angle to ensure clearance
    const requiredAngle = Math.max(obstructionAngle, liftAngle);
    
    // Calculate minimum boom length using trigonometry
    const angleInRadians = requiredAngle * (Math.PI / 180);
    const minBoomLength = liftRadius / Math.cos(angleInRadians);

    // Calculate vertical height at boom tip
    const minVerticalHeight = minBoomLength * Math.sin(angleInRadians);

    return {
      boomAngle: Number(requiredAngle.toFixed(1)),
      minBoomLength: Number(minBoomLength.toFixed(1)),
      minVerticalHeight: Number(minVerticalHeight.toFixed(1))
    };
  };

  const handleCalculate = () => {
    if (!currentUser) {
      toast.error(t('calculator.loginRequired'));
      return;
    }

    if (!currentUser.emailVerified) {
      toast((t) => (
        <div>
          <p className="font-semibold">{t('calculator.verificationRequired')}</p>
          <p className="text-sm">{t('auth.verifyEmail')}</p>
        </div>
      ), {
        duration: 5000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          padding: '16px',
        },
      });
      return;
    }

    const results = calculateCraneLift();
    const newValues = { ...values, ...results };
    setValues(newValues);
    globalCalculatorState = newValues;
    setShowResults(true);
  };

  const handleNext = () => {
    navigate('/results', { state: { results: values } });
  };

  const isCalculateDisabled = !currentUser || !currentUser.emailVerified;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-colors duration-200"
    >
      <QrScanner />

      <div className="bg-yellow-400 dark:bg-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 dark:text-white">
          <CalculatorIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          {t('calculator.title')}
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          {t('calculator.reset')}
        </motion.button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <InputField
            label={t('calculator.buildingHeight')}
            value={values.buildingHeight}
            onChange={(value) => handleInputChange('buildingHeight', value)}
            unit={t('units.meters')}
            type="height"
          />
          <InputField
            label={t('calculator.craneEdgeDistance')}
            value={values.craneEdgeDistance}
            onChange={(value) => handleInputChange('craneEdgeDistance', value)}
            unit={t('units.meters')}
            type="radius"
          />
          <InputField
            label={t('calculator.liftTackle')}
            value={values.liftTackle}
            onChange={(value) => handleInputChange('liftTackle', value)}
            unit={t('units.tons')}
            type="load"
          />
          <InputField
            label={t('calculator.requiredLoad')}
            value={values.requiredLoad}
            onChange={(value) => handleInputChange('requiredLoad', value)}
            unit={t('units.tons')}
            type="load"
          />
          <InputField
            label={t('calculator.liftRadius')}
            value={values.liftRadius}
            onChange={(value) => handleInputChange('liftRadius', value)}
            unit={t('units.meters')}
            type="radius"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: isCalculateDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isCalculateDisabled ? 1 : 0.95 }}
            onClick={handleCalculate}
            disabled={isCalculateDisabled}
            className="flex-1 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('calculator.calculate')}
          </motion.button>

          {showResults && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {t('calculator.next')}
            </motion.button>
          )}
        </div>

        {showResults && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <ResultCard label={t('calculator.totalLoad')} value={values.totalLoad} unit={t('units.tons')} />
              <ResultCard label={t('calculator.boomAngle')} value={values.boomAngle} unit={t('units.degrees')} />
              <ResultCard label={t('calculator.liftRadius')} value={values.liftRadius} unit={t('units.meters')} />
              <ResultCard label={t('calculator.minBoomLength')} value={values.minBoomLength} unit={t('units.meters')} />
              <ResultCard label={t('calculator.minVerticalHeight')} value={values.minVerticalHeight} unit={t('units.meters')} />
            </div>
          </div>
        )}

        {!currentUser && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('calculator.loginRequired')}
          </p>
        )}
        {currentUser && !currentUser.emailVerified && (
          <button
            onClick={handleResendVerification}
            disabled={resending}
            className="w-full text-center text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            {resending ? 'Sending verification email...' : t('calculator.verificationRequired')}
          </button>
        )}
      </div>
    </motion.div>
  );
};
