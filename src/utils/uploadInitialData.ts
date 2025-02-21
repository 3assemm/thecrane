import { db, auth } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface CraneData {
  craneId: string;
  manufacturer: string;
  model: string;
  capacity: number;
  specifications: {
    maxCapacity: number;
    minBoomLength: number;
    maxBoomLength: number;
    maxRadius: number;
    minRadius: number;
  };
  loadChart: {
    radius: number;
    capacity: number;
    boomLength: number;
  }[];
  updatedAt: string;
  createdBy: string;
  searchableCapacity: number;
  searchableRadius: number;
  searchableBoomLength: number;
}

export const uploadInitialCraneData = async (craneData: CraneData[]) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.email !== '3assem@gmail.com') {
      throw new Error('Only administrators can upload initial data');
    }

    const modelsCollection = collection(db, 'models');
    const loadChartsCollection = collection(db, 'loadCharts');

    for (const crane of craneData) {
      // Upload crane model
      const modelDoc = doc(modelsCollection, crane.craneId);
      await setDoc(modelDoc, {
        craneId: crane.craneId,
        manufacturer: crane.manufacturer,
        model: crane.model,
        capacity: crane.capacity,
        specifications: crane.specifications,
        createdBy: crane.createdBy,
        updatedAt: crane.updatedAt,
        searchableCapacity: crane.searchableCapacity,
        searchableRadius: crane.searchableRadius,
        searchableBoomLength: crane.searchableBoomLength
      });

      // Upload load chart
      const chartDoc = doc(loadChartsCollection, crane.craneId);
      await setDoc(chartDoc, {
        craneId: crane.craneId,
        points: crane.loadChart,
        createdBy: crane.createdBy,
        updatedAt: crane.updatedAt
      });
    }

    toast.success('Initial crane data uploaded successfully');
    return true;
  } catch (error: any) {
    console.error('Error uploading initial crane data:', error);
    toast.error(`Failed to upload initial crane data: ${error.message}`);
    return false;
  }
};
