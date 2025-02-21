import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';
import { UserPreferences, UserStats } from '../../types/user';
import toast from 'react-hot-toast';

export const createOrUpdateUserPreferences = async (preferences: UserPreferences) => {
  const userRef = doc(db, 'userPreferences', preferences.id);
  await setDoc(userRef, preferences, { merge: true });

  // Initialize stats if new user
  const statsRef = doc(db, 'userStats', preferences.id);
  await setDoc(statsRef, {
    userId: preferences.id,
    totalCalculations: 0,
    existingCalculations: 0,
    createdAt: preferences.createdAt
  }, { merge: true });
};

export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const userRef = doc(db, 'userPreferences', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserPreferences;
  } catch (error: any) {
    console.error('Error fetching user preferences:', error);
    toast.error(`Failed to fetch user preferences: ${error.message}`);
    return null;
  }
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const statsRef = doc(db, 'userStats', userId);
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      return null;
    }
    
    return statsDoc.data() as UserStats;
  } catch (error: any) {
    console.error('Error fetching user stats:', error);
    toast.error(`Failed to fetch user stats: ${error.message}`);
    return null;
  }
};

export const getAllUserPreferences = async (): Promise<UserPreferences[]> => {
  try {
    const q = query(collection(db, 'userPreferences'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserPreferences);
  } catch (error: any) {
    console.error('Error fetching all user preferences:', error);
    toast.error(`Failed to fetch user preferences: ${error.message}`);
    return [];
  }
};

export const updateUserPreferences = async (
  userId: string, 
  updates: Partial<UserPreferences>
): Promise<void> => {
  try {
    const userRef = doc(db, 'userPreferences', userId);
    await setDoc(userRef, updates, { merge: true });
  } catch (error: any) {
    console.error('Error updating user preferences:', error);
    toast.error(`Failed to update user preferences: ${error.message}`);
    throw error;
  }
};
