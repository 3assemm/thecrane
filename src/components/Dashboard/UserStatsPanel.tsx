import React from 'react';
import { Calculator, History } from 'lucide-react';

// Interface for the UserStatsPanel component props
interface UserStatsPanelProps {
  totalCalculations: number;
  existingCalculations: number;
}

/**
 * UserStatsPanel component - displays key statistics about the user's calculations.
 *
 * @param {UserStatsPanelProps} props - The component props.
 * @param {number} props.totalCalculations - The total number of calculations performed by the user.
 * @param {number} props.existingCalculations - The number of calculations currently saved by the user.
 * @returns {React.ReactElement} The UserStatsPanel component.
 */
export const UserStatsPanel: React.FC<UserStatsPanelProps> = ({
  totalCalculations,
  existingCalculations,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Total Existing Calculations Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          {/* Calculator icon */}
          <Calculator className="w-8 h-8 text-yellow-500" />
          <div>
            <h3 className="text-lg font-semibold dark:text-white">
              Total Existing Calculations
            </h3>
            {/* Display the number of existing calculations */}
            <p className="text-3xl font-bold text-yellow-500">
              {existingCalculations}
            </p>
          </div>
        </div>
      </div>

      {/* Total Calculations Since Registration Card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          {/* History icon */}
          <History className="w-8 h-8 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold dark:text-white">
              Total Calculations Since Registration
            </h3>
            {/* Display the total number of calculations */}
            <p className="text-3xl font-bold text-green-500">
              {totalCalculations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
