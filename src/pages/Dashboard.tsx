import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { DashboardFilters } from '../components/Dashboard/DashboardFilters';
import { CalculationTable } from '../components/Dashboard/CalculationTable';
import { useCalculations } from '../hooks/useCalculations';
import { useTheme } from '../hooks/useTheme';
import { Toaster } from 'react-hot-toast';
import { Calculation } from '../types/calculation';
import { generatePDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { useUserStats } from '../hooks/useUserStats';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { stats } = useUserStats();
  const { isDark } = useTheme();
  const {
    calculations,
    loading,
    handleDelete,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useCalculations();
  const { t } = useTranslation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleDownload = async (calculation: Calculation) => {
    try {
      await generatePDF(calculation);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const handlePrint = async (calculation: Calculation) => {
    try {
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Crane Calculation Report</h1>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Project Details</h2>
            <p><strong>Project Name:</strong> ${calculation.projectName}</p>
            <p><strong>Location:</strong> ${calculation.projectLocation}</p>
            <p><strong>Date:</strong> ${new Date(calculation.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Calculation Results</h2>
            <p><strong>Total Load:</strong> ${calculation.totalLoad}T</p>
            <p><strong>Boom Angle:</strong> ${calculation.boomAngle}°</p>
            <p><strong>Min Boom Length:</strong> ${calculation.minBoomLength}m</p>
            <p><strong>Building Height:</strong> ${calculation.buildingHeight}m</p>
            <p><strong>Crane Edge Distance:</strong> ${calculation.craneEdgeDistance}m</p>
            <p><strong>Lift Radius:</strong> ${calculation.liftRadius}m</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Selected Cranes</h2>
            <ul>
              ${calculation.selectedCranes.map(crane => `<li>${crane}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(element.innerHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    } catch (error: any) {
      console.error('Error printing calculation:', error);
      toast.error(`Failed to print calculation: ${error.message}`);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Statistics */}
        <DashboardStats stats={stats} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold dark:text-white mb-6">Calculation History</h2>
            
            {/* Filters for the calculation table */}
            <DashboardFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {/* Loading indicator */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              </div>
            ) : calculations.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                No calculations found
              </p>
            ) : (
              /* Calculation Table */
              <CalculationTable
                calculations={calculations}
                handleDelete={handleDelete} // Pass handleDelete to CalculationTable
                handleDownload={handleDownload}
                handlePrint={handlePrint}
              />
            )}
          </div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};
