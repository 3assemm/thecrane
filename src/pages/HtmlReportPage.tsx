import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HtmlReport } from '../components/HtmlReport';
import { Calculation } from '../types/calculation';
import { Printer, Share2, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { generatePDF } from '../utils/pdfGenerator';

export const HtmlReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const calculation = location.state?.calculation as Calculation;
  const [showShareMenu, setShowShareMenu] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async (calculation: Calculation) => {
    try {
      await generatePDF(calculation);
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast.error(`Failed to generate PDF: ${error.message}`);
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

  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50 print:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white p-3 rounded-full shadow-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 print:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDownload(calculation)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          title="Download PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePrint(calculation)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          title="Print"
        >
          <Printer className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
          title="Share"
        >
          <Share2 className="w-6 h-6" />
        </motion.button>

        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4"
            >
              <button
                onClick={() => {
                  // Implement email sharing logic here
                  toast.success('Email sharing coming soon!');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                <Mail className="w-5 h-5" />
                Email
              </button>
              <button
                onClick={() => {
                  // Implement WhatsApp sharing logic here
                  toast.success('WhatsApp sharing coming soon!');
                  setShowShareMenu(false);
                }}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div id="report-content">
        <HtmlReport calculation={calculation} />
      </div>
    </div>
  );
};
