import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { CraneModel } from '../../types/crane';
import toast from 'react-hot-toast';

export const findSuitableCranes = async (
  totalLoad: number,
  liftRadius: number,
  minBoomLength: number
): Promise<CraneModel[]> => {
  try {
    const modelsRef = collection(db, 'models');
    const querySnapshot = await getDocs(modelsRef);
    
    const suitableCranes = querySnapshot.docs
      .map(doc => ({
        ...doc.data(),
        craneId: doc.id
      }))
      .filter(crane => 
        crane.capacity >= totalLoad &&
        crane.specifications.maxRadius >= liftRadius &&
        crane.specifications.maxBoomLength >= minBoomLength &&
        crane.specifications.minRadius <= liftRadius
      )
      .sort((a, b) => a.capacity - b.capacity);

    return suitableCranes as CraneModel[];
  } catch (error: any) {
    console.error('Failed to find suitable cranes:', error);
    toast.error(`Failed to find suitable cranes: ${error.message}`);
    throw error;
  }
};
