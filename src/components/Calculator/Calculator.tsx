import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalculatorIcon, RotateCcw, Mail } from 'lucide-react';
import { InputField } from '../InputField';
import { ResultCard } from '../ResultCard';
import { QrScanner } from '../QrScanner';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next'; // Import Trans
import toast from 'react-hot-toast';

// Initial state for the calculator
const INITIAL_VALUES = {
  buildingHeight: 3,
  liftHeight: 0,
  craneEdgeDistance: 5,
  liftRadius: 5,
  requiredLoad: 0.5,
  liftTackle: 0.5,
  totalLoad: 1,
  boomAngle: 0,
  minBoomLength: 0,
  minVerticalHeight: 0,
};

interface CraneCalculatorProps {
  initialValues?: typeof INITIAL_VALUES;
  editMode?: boolean;
}

export const CraneCalculator: React.FC<CraneCalculatorProps> = ({
  initialValues,
  editMode = false,
}) => {
  const { currentUser, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  const [values, setValues] = useState(initialValues || INITIAL_VALUES);
  const [resending, setResending] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false); // Track if calculation has been done
  const location = useLocation();

  // Initialize from location state if available
  useEffect(() => {
    if (location.state?.results) {
      setValues(location.state.results);
      setShowResults(true);
      setHasCalculated(true); // Set hasCalculated to true if results are preloaded
    }
  }, [location.state]);

  // Validate input values
  const validateInput = (value: number) => {
    if (isNaN(value) || value < 0) {
      toast.error(t('calculator.invalidInput'));
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: number) => {
    if (!validateInput(value)) return;

    setValues((prev) => {
      const newValues = {
        ...prev,
        [field]: value,
        totalLoad:
          field === 'requiredLoad' || field === 'liftTackle'
            ? Number(value) + (field === 'requiredLoad' ? prev.liftTackle : prev.requiredLoad)
            : prev.totalLoad,
      };
      return newValues;
    });
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (resending) return;

    setResending(true);
    try {
      await resendVerificationEmail();
      toast.success(t('calculator.verificationEmailSent'));
    } catch (error) {
      toast.error(t('calculator.verificationEmailFailed'));
    } finally {
      setResending(false);
    }
  };

  // Reset calculator to initial values
  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setShowResults(false);
    setHasCalculated(false); // Reset hasCalculated on reset
  };

  // Calculate crane lift parameters
  const calculateCraneLift = () => {
    const { buildingHeight, craneEdgeDistance, liftRadius, liftHeight } = values;

    // Calculate minimum angle needed to clear the building
    const obstructionAngle = Math.atan2(buildingHeight, craneEdgeDistance) * (180 / Math.PI);

    // Calculate angle needed to reach the lift point
    const liftAngle = Math.atan2(liftHeight, liftRadius) * (180 / Math.PI);

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
      minVerticalHeight: Number(minVerticalHeight.toFixed(1)),
    };
  };

  // Handle calculate button click
  const handleCalculate = () => {
    if (!currentUser) {
      toast.error(t('calculator.loginRequired'));
      return;
    }

    if (!currentUser.emailVerified) {
      toast.error(t('calculator.verificationRequired'));
      return;
    }

    const results = calculateCraneLift();
    const newValues = { ...values, ...results };
    setValues(newValues);
    setShowResults(true);
    setHasCalculated(true); // Set hasCalculated to true after calculation
  };

  // Handle next button click
  const handleNext = () => {
    if (editMode && initialValues) {
      navigate('/dashboard');
    } else {
      navigate('/results', { state: { results: values } });
    }
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
          <InputField
            label={t('calculator.liftTackle')}
            value={values.liftTackle}
            onChange={(value) => handleInputChange('liftTackle', value)}
            unit={t('units.tons')}
            type="load"
          />
          <InputField
            label={t('calculator.liftHeight')}
            value={values.liftHeight}
            onChange={(value) => handleInputChange('liftHeight', value)}
            unit={t('units.meters')}
            type="height"
          />

          {/* Add the descriptive text here */}
          <div className="col-span-full text-sm text-gray-600 dark:text-gray-400">
            {t('calculator.obstructionHint')}
          </div>

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
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: isCalculateDisabled ? 1 : 1.05 }}
            whileTap={{ scale: isCalculateDisabled ? 1 : 0.95 }}
            onClick={handleCalculate}
            disabled={isCalculateDisabled}
            className="flex-1 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasCalculated ? t('calculator.reCalculate') : t('calculator.calculate')}
          </motion.button>
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

            {/* Move the "Next" button here */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full mt-6 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {t('calculator.next')}
            </motion.button>
          </div>
        )}

        {!currentUser ? (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            <Trans
              i18nKey="calculator.loginOrSignup"
              components={[
                <Link to="/login" className="text-yellow-600 hover:underline" />,
                <Link to="/signup" className="text-yellow-600 hover:underline" />,
              ]}
            />
          </p>
        ) : (
          currentUser && !currentUser.emailVerified && (
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full text-center text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {resending ? t('calculator.sendingVerificationEmail') : t('calculator.verificationRequired')}
            </button>
          )
        )}
      </div>
    </motion.div>
  );
};