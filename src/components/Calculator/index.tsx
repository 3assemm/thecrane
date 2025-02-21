import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator as CalculatorIcon, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { InputField } from '../InputField';
import { ResultCard } from '../ResultCard';
import { QrScanner } from '../QrScanner';
import { saveCalculation } from '../../lib/firebase/calculations';
import { Calculation } from '../../types/calculation';
import toast from 'react-hot-toast';

interface CraneCalculatorProps {
  initialValues?: Calculation;
  editMode?: boolean;
}

export const CraneCalculator: React.FC<CraneCalculatorProps> = ({ 
  initialValues,
  editMode = false
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showResults, setShowResults] = useState(false);
  
  // Initialize state with calculation data if in edit mode
  const [values, setValues] = useState({
    buildingHeight: initialValues?.buildingHeight || 3,
    craneEdgeDistance: initialValues?.craneEdgeDistance || 5,
    liftRadius: initialValues?.liftRadius || 7,
    requiredLoad: initialValues?.requiredLoad || 0.5,
    liftTackle: initialValues?.liftTackle || 0.5,
    totalLoad: initialValues?.totalLoad || 1,
    boomAngle: initialValues?.boomAngle || 0,
    minBoomLength: initialValues?.minBoomLength || 0,
    minVerticalHeight: initialValues?.minVerticalHeight || 0
  });

  // Show results immediately in edit mode
  useEffect(() => {
    if (editMode && initialValues) {
      setShowResults(true);
    }
  }, [editMode, initialValues]);

  const handleInputChange = (field: string, value: number) => {
    setValues(prev => {
      const newValues = {
        ...prev,
        [field]: value,
        totalLoad: field === 'requiredLoad' || field === 'liftTackle' 
          ? Number(value) + (field === 'requiredLoad' ? prev.liftTackle : prev.requiredLoad)
          : prev.totalLoad
      };
      return newValues;
    });
  };

  const handleCalculate = () => {
    if (!currentUser) {
      toast.error('Please log in to use the calculator');
      return;
    }

    if (!currentUser.emailVerified) {
      toast.error('Please verify your email to use the calculator');
      return;
    }

    const { buildingHeight, craneEdgeDistance, liftRadius } = values;
    
    const obstructionAngle = Math.atan2(buildingHeight, craneEdgeDistance) * (180 / Math.PI);
    const liftAngle = Math.atan2(buildingHeight, liftRadius) * (180 / Math.PI);
    const requiredAngle = Math.max(obstructionAngle, liftAngle);
    const angleInRadians = requiredAngle * (Math.PI / 180);
    const minBoomLength = liftRadius / Math.cos(angleInRadians);
    const minVerticalHeight = minBoomLength * Math.sin(angleInRadians);

    setValues(prev => ({
      ...prev,
      boomAngle: Number(requiredAngle.toFixed(1)),
      minBoomLength: Number(minBoomLength.toFixed(1)),
      minVerticalHeight: Number(minVerticalHeight.toFixed(1))
    }));
    setShowResults(true);
  };

  const handleNext = async () => {
    if (editMode && initialValues) {
      try {
        const updatedCalculation = {
          ...initialValues,
          ...values,
          updatedAt: new Date().toISOString()
        };
        await saveCalculation(updatedCalculation);
        toast.success('Calculation updated successfully');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to update calculation');
      }
    } else {
      navigate('/results', { state: { results: values } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
    >
      <QrScanner />

      <div className="bg-yellow-400 dark:bg-gray-700 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 dark:text-white">
          <CalculatorIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          {editMode ? 'Edit Calculation' : 'Crane Size Calculator'}
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          Cancel
        </motion.button>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Building Height"
            value={values.buildingHeight}
            onChange={(value) => handleInputChange('buildingHeight', value)}
            unit="m"
            type="height"
          />
          <InputField
            label="Crane Edge Distance"
            value={values.craneEdgeDistance}
            onChange={(value) => handleInputChange('craneEdgeDistance', value)}
            unit="m"
            type="radius"
          />
          <InputField
            label="Lift Tackle"
            value={values.liftTackle}
            onChange={(value) => handleInputChange('liftTackle', value)}
            unit="T"
            type="load"
          />
          <InputField
            label="Required Load"
            value={values.requiredLoad}
            onChange={(value) => handleInputChange('requiredLoad', value)}
            unit="T"
            type="load"
          />
          <InputField
            label="Lift Radius"
            value={values.liftRadius}
            onChange={(value) => handleInputChange('liftRadius', value)}
            unit="m"
            type="radius"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCalculate}
            className="flex-1 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
          >
            Calculate
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
              {editMode ? 'Save Changes' : 'Next'}
            </motion.button>
          )}
        </div>

        {showResults && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <ResultCard label="Total Load" value={values.totalLoad} unit="T" />
              <ResultCard label="Boom Angle" value={values.boomAngle} unit="°" />
              <ResultCard label="Lift Radius" value={values.liftRadius} unit="m" />
              <ResultCard label="Min Boom Length" value={values.minBoomLength} unit="m" />
              <ResultCard label="Min Vertical Height" value={values.minVerticalHeight} unit="m" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
