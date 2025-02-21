import { doc, collection, query, where, orderBy, getDocs, runTransaction, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { Calculation } from '../../types/calculation';
import toast from 'react-hot-toast';

export const saveCalculation = async (calculation: Calculation): Promise<void> => {
  try {
    const calculationsRef = collection(db, 'calculations');
    const userStatsRef = doc(db, 'userStats', calculation.userId);
    const userPrefsRef = doc(db, 'userPreferences', calculation.userId);

    await runTransaction(db, async (transaction) => {
      // Check user role and calculation limit
      const userPrefs = await transaction.get(userPrefsRef);
      const userStats = await transaction.get(userStatsRef);
      
      if (!userPrefs.exists()) {
        throw new Error('User preferences not found');
      }

      const role = userPrefs.data().role;
      const totalCalcs = userStats.exists() ? userStats.data().totalCalculations : 0;

      // Only enforce free tier limit for new calculations
      if (!calculation.id && role === 'free' && totalCalcs >= 10) {
        throw new Error('Free tier calculation limit reached');
      }

      // Update user stats for new calculations
      if (!calculation.id && userStats.exists()) {
        transaction.update(userStatsRef, {
          totalCalculations: totalCalcs + 1,
          existingCalculations: userStats.data().existingCalculations + 1
        });
      }

      // Save calculation
      const calcRef = calculation.id 
        ? doc(calculationsRef, calculation.id)
        : doc(calculationsRef);

      transaction.set(calcRef, {
        ...calculation,
        id: calcRef.id,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });

    toast.success(calculation.id ? 'Calculation updated successfully' : 'Calculation saved successfully');
  } catch (error: any) {
    console.error('Error saving calculation:', error);
    toast.error(`Failed to save calculation: ${error.message}`);
    throw error;
  }
};

export const deleteCalculation = async (id: string): Promise<void> => {
  try {
    const calcRef = doc(db, 'calculations', id);
    await deleteDoc(calcRef);
    toast.success('Calculation deleted successfully');
  } catch (error: any) {
    console.error('Failed to delete calculation:', error);
    toast.error(`Failed to delete calculation: ${error.message}`);
    throw error;
  }
};

export const getCalculations = async (userId: string): Promise<Calculation[]> => {
  try {
    const q = query(
      collection(db, 'calculations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Calculation[];
  } catch (error) {
    console.error('Failed to fetch calculations:', error);
    throw error;
  }
};
