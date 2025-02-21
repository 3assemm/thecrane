import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface UserStatsPanelProps {
  userId: string;
  totalCalculations: number;
  calculationLimit: number;
}

export const UserStatsPanel: React.FC<UserStatsPanelProps> = ({
  userId,
  totalCalculations,
  calculationLimit
}) => {
  const handleUpdateLimit = async (newLimit: number) => {
    try {
      const statsRef = doc(db, 'userStats', userId);
      await setDoc(statsRef, {
        calculationLimit: newLimit
      }, { merge: true });
      toast.success('Updated calculation limit');
    } catch (error) {
      toast.error('Failed to update limit');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <Calculator className="w-6 h-6 text-yellow-500" />
        <div>
          <h3 className="font-medium">Calculation Stats</h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Calculations:</span>
              <span className="font-semibold">{totalCalculations}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Calculation Limit:</span>
              <input
                type="number"
                min="0"
                value={calculationLimit}
                onChange={(e) => handleUpdateLimit(parseInt(e.target.value))}
                className="w-20 rounded-md border-gray-300 dark:border-gray-600 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
