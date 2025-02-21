import React from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatting';
import { Calculation } from '../types/calculation';
import { CraneOperationDiagram } from './charts/CraneOperationDiagram';

interface HtmlReportProps {
  calculation: Calculation;
}

export const HtmlReport: React.FC<HtmlReportProps> = ({ calculation }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Crane Calculation Report</h1>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Generated on: {formatDate(calculation.createdAt)}</p>
          </div>
          {(calculation.ownerLogo || calculation.contractorLogo) && (
            <div className="flex gap-4">
              {calculation.ownerLogo && (
                <img src={calculation.ownerLogo} alt="Owner Logo" className="h-16 object-contain" />
              )}
              {calculation.contractorLogo && (
                <img src={calculation.contractorLogo} alt="Contractor Logo" className="h-16 object-contain" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Information */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Project Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400"><strong>Project Name:</strong> {calculation.projectName}</p>
            <p className="text-gray-600 dark:text-gray-400"><strong>Location:</strong> {calculation.projectLocation}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400"><strong>Date:</strong> {calculation.projectDate}</p>
          </div>
        </div>
      </motion.section>

      {/* Calculation Results */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Calculation Results</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Load</p>
            <p className="text-xl font-bold dark:text-white">{calculation.totalLoad}T</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Boom Angle</p>
            <p className="text-xl font-bold dark:text-white">{calculation.boomAngle}°</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Min Boom Length</p>
            <p className="text-xl font-bold dark:text-white">{calculation.minBoomLength}m</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Building Height</p>
            <p className="text-xl font-bold dark:text-white">{calculation.buildingHeight}m</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Crane Edge Distance</p>
            <p className="text-xl font-bold dark:text-white">{calculation.craneEdgeDistance}m</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Lift Radius</p>
            <p className="text-xl font-bold dark:text-white">{calculation.liftRadius}m</p>
          </div>
        </div>
      </motion.section>

      {/* Crane Operation Diagram */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Crane Operation Diagram</h2>
        <CraneOperationDiagram data={calculation} />
      </motion.section>

      {/* Selected Cranes */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Selected Cranes</h2>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-2">
            {calculation.selectedCranes.map((crane, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-400">{crane}</li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Photos */}
      {calculation.images && calculation.images.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculation.images.map((image, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <img 
                  src={image.url} 
                  alt={image.caption || 'Report image'} 
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                {image.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{image.caption}</p>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};
