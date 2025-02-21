// src/lib/firebase/publicCalculations.ts

import { doc, collection, query, where, orderBy, getDocs, runTransaction, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import { Calculation } from '../../types/calculation';
import toast from 'react-hot-toast';

export const savePublicCalculation = async (calculation: Calculation): Promise<void> => {
  try {
    const publicCalcsRef = collection(db, 'publicCalculations');
    const userStatsRef = doc(db, 'userStats', calculation.userId);

    await runTransaction(db, async (transaction) => {
      // Create new public calculation
      const newCalcRef = doc(publicCalcsRef);
      transaction.set(newCalcRef, {
        ...calculation,
        id: newCalcRef.id,
        isPublic: true,
        createdAt: new Date().toISOString()
      });

      // Update user stats
      const userStatsDoc = await transaction.get(userStatsRef);
      if (userStatsDoc.exists()) {
        transaction.update(userStatsRef, {
          publicCalculations: (userStatsDoc.data().publicCalculations || 0) + 1
        });
      }
    });

    toast.success('Calculation published successfully');
  } catch (error: any) {
    console.error('Error saving public calculation:', error);
    toast.error(`Failed to save public calculation: ${error.message}`);
    throw error;
  }
};

export const getPublicCalculations = async (): Promise<Calculation[]> => {
  try {
    const q = query(
      collection(db, 'publicCalculations'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Calculation[];
  } catch (error: any) {
    console.error('Failed to fetch public calculations:', error);
    toast.error(`Failed to fetch public calculations: ${error.message}`);
    throw error;
  }
};

export const getUserPublicCalculations = async (userId: string): Promise<Calculation[]> => {
  try {
    const q = query(
      collection(db, 'publicCalculations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Calculation[];
  } catch (error: any) {
    console.error('Failed to fetch user public calculations:', error);
    toast.error(`Failed to fetch user public calculations: ${error.message}`);
    throw error;
  }
};

export const deletePublicCalculation = async (id: string, userId: string): Promise<void> => {
  try {
    const calcRef = doc(db, 'publicCalculations', id);
    const userStatsRef = doc(db, 'userStats', userId);

    await runTransaction(db, async (transaction) => {
      // Update user stats
      const userStatsDoc = await transaction.get(userStatsRef);
      if (userStatsDoc.exists()) {
        transaction.update(userStatsRef, {
          publicCalculations: Math.max(0, userStatsDoc.data().publicCalculations - 1)
        });
      }

      // Delete public calculation
      transaction.delete(calcRef);
    });

    toast.success('Public calculation deleted successfully');
  } catch (error: any) {
    console.error('Error deleting public calculation:', error);
    toast.error(`Failed to delete public calculation: ${error.message}`);
    throw error;
  }
};
