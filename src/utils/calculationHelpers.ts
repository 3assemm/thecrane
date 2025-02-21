import { Calculation } from '../types/calculation';

export const extractCalculationFormData = (calculation: Calculation) => {
  return {
    buildingHeight: calculation.buildingHeight,
    craneEdgeDistance: calculation.craneEdgeDistance,
    liftTackle: calculation.liftTackle,
    requiredLoad: calculation.requiredLoad,
    liftRadius: calculation.liftRadius
  };
};

export const isEditMode = (pathname: string) => {
  return pathname.includes('/edit');
};
