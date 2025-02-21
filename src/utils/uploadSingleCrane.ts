import { db, auth } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import toast from 'react-hot-toast';

export const uploadLTM1030Data = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.email !== '3assem@gmail.com') {
      throw new Error('Only administrators can upload data');
    }

    const craneData = {
      craneId: "liebherr-ltm1030",
      manufacturer: "Liebherr",
      model: "LTM 1030-2.1",
      capacity: 35,
      specifications: {
        maxCapacity: 35,
        minBoomLength: 9.2,
        maxBoomLength: 30,
        maxRadius: 26,
        minRadius: 3
      },
      loadChart: [
        {
          radius: 3,
          capacity: 35,
          boomLength: 9.2
        }
      ],
      updatedAt: new Date().toISOString(),
      createdBy: "3assem@gmail.com",
      searchableCapacity: 35,
      searchableRadius: 26,
      searchableBoomLength: 30
    };

    const craneRef = doc(collection(db, 'craneLoadCharts'), craneData.craneId);
    await setDoc(craneRef, craneData);
    
    toast.success('LTM 1030-2.1 data uploaded successfully');
    return true;
  } catch (error: any) {
    console.error('Error uploading LTM 1030-2.1 data:', error);
    toast.error(`Failed to upload LTM 1030-2.1 data: ${error.message}`);
    return false;
  }
};
