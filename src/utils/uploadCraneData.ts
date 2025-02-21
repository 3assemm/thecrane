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

export const uploadCraneData = async (craneData: CraneData[]) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.email !== '3assem@gmail.com') {
      throw new Error('Only administrators can upload data');
    }

    const craneCollection = collection(db, 'craneLoadCharts');

    for (const crane of craneData) {
      const docRef = doc(craneCollection, crane.craneId);
      await setDoc(docRef, crane);
      console.log(`Uploaded crane: ${crane.manufacturer} ${crane.model}`);
    }

    toast.success('Crane data uploaded successfully');
    return true;
  } catch (error: any) {
    console.error('Error uploading crane data:', error);
    toast.error(`Failed to upload crane data: ${error.message}`);
    return false;
  }
};
