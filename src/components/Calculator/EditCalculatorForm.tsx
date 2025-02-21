import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculation } from '../../types/calculation';
import { InputField } from '../InputField';
import { ResultCard } from '../ResultCard';
import { saveCalculation } from '../../lib/firebase/calculations';
import toast from 'react-hot-toast';

interface EditCalculatorFormProps {
  calculation: Calculation;
  onCancel: () => void;
}

export const EditCalculatorForm: React.FC<EditCalculatorFormProps> = ({
  calculation,
  onCancel
}) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    buildingHeight: calculation.buildingHeight,
    craneEdgeDistance: calculation.craneEdgeDistance,
    liftRadius: calculation.liftRadius,
    requiredLoad: calculation.requiredLoad,
    liftTackle: calculation.liftTackle,
    totalLoad: calculation.totalLoad,
    boomAngle: calculation.boomAngle,
    minBoomLength: calculation.minBoomLength,
    minVerticalHeight: calculation.minVerticalHeight
  });
  const [saving, setSaving] = useState(false);

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

  const calculateResults = () => {
    const { buildingHeight, craneEdgeDistance, liftRadius } = values;
    
    const obstructionAngle = Math.atan2(buildingHeight, craneEdgeDistance) * (180 / Math.PI);
    const liftAngle = Math.atan2(buildingHeight, liftRadius) * (180 / Math.PI);
    const requiredAngle = Math.max(obstructionAngle, liftAngle);
    const angleInRadians = requiredAngle * (Math.PI / 180);
    const minBoomLength = liftRadius / Math.cos(angleInRadians);
    const minVerticalHeight = minBoomLength * Math.sin(angleInRadians);

    return {
      boomAngle: Number(requiredAngle.toFixed(1)),
      minBoomLength: Number(minBoomLength.toFixed(1)),
      minVerticalHeight: Number(minVerticalHeight.toFixed(1))
    };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = calculateResults();
      const updatedCalculation = {
        ...calculation,
        ...values,
        ...results,
        updatedAt: new Date().toISOString()
      };

      await saveCalculation(updatedCalculation);
      toast.success('Calculation updated successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to update calculation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Total Load" value={values.totalLoad} unit="T" />
        <ResultCard label="Boom Angle" value={values.boomAngle} unit="°" />
        <ResultCard label="Min Boom Length" value={values.minBoomLength} unit="m" />
      </div>

      <div className="flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </div>
  );
};
