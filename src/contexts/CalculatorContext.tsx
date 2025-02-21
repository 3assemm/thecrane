import React, { createContext, useContext, useState } from 'react';
import { Calculation } from '../types/calculation';

interface CalculatorState {
  buildingHeight: number;
  craneEdgeDistance: number;
  liftRadius: number;
  requiredLoad: number;
  liftTackle: number;
  totalLoad: number;
  boomAngle: number;
  minBoomLength: number;
  minVerticalHeight: number;
}

interface CalculatorContextType {
  values: CalculatorState;
  setValues: React.Dispatch<React.SetStateAction<CalculatorState>>;
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  editMode: boolean;
  originalCalculation: Calculation | null;
  updateCalculation: (calculation: Calculation) => void;
}

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [values, setValues] = useState<CalculatorState>({
    buildingHeight: 0,
    craneEdgeDistance: 0,
    liftRadius: 0,
    requiredLoad: 0,
    liftTackle: 0,
    totalLoad: 0,
    boomAngle: 0,
    minBoomLength: 0,
    minVerticalHeight: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalCalculation, setOriginalCalculation] = useState<Calculation | null>(null);

  const updateCalculation = (calculation: Calculation) => {
    setEditMode(true);
    setOriginalCalculation(calculation);
    setValues({
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
    setShowResults(true);
  };

  return (
    <CalculatorContext.Provider 
      value={{ 
        values, 
        setValues, 
        showResults, 
        setShowResults,
        editMode,
        originalCalculation,
        updateCalculation
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};
