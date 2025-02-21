import React from 'react';
import { Search, Calendar } from 'lucide-react';

// Interface for the DashboardFilters component props
interface DashboardFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

/**
 * DashboardFilters component - provides input fields for filtering calculations by search term and date range.
 *
 * @param {DashboardFiltersProps} props - The component props.
 * @param {string} props.searchTerm - The current search term.
 * @param {(value: string) => void} props.setSearchTerm - Function to update the search term.
 * @param {string} props.startDate - The start date for filtering.
 * @param {(value: string) => void} props.setStartDate - Function to update the start date.
 * @param {string} props.endDate - The end date for filtering.
 * @param {(value: string) => void} props.setEndDate - Function to update the end date.
 * @returns {React.ReactElement} The DashboardFilters component.
 */
export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search input */}
      <div className="flex-1">
        <div className="relative">
          {/* Search icon */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search calculations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      {/* Date range inputs */}
      <div className="flex gap-4">
        <div className="relative">
          {/* Calendar icon for start date */}
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          {/* Calendar icon for end date */}
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
};
