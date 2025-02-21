import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, History } from 'lucide-react';
import { UserStats } from '../../types/user';

// Interface for the DashboardStats component props
interface DashboardStatsProps {
  stats: UserStats | null;
}

/**
 * DashboardStats component - displays key statistics about the user's calculations.
 *
 * @param {DashboardStatsProps} props - The component props.
 * @param {UserStats | null} props.stats - The user's statistics, or null if not yet loaded.
 * @returns {React.ReactElement} The DashboardStats component.
 */
export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Existing Calculations Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center gap-4">
          {/* Calculator icon */}
          <Calculator className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Total Existing Calculations</h3>
            {/* Display the number of existing calculations */}
            <p className="text-3xl font-bold text-yellow-500">{stats?.existingCalculations || 0}</p>
          </div>
        </div>
      </motion.div>

      {/* Total Calculations Since Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <div className="flex items-center gap-4">
          {/* History icon */}
          <History className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Total Calculations Since Registration</h3>
            {/* Display the total number of calculations */}
            <p className="text-3xl font-bold text-green-500">{stats?.totalCalculations || 0}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
