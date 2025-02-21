import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveCalculation } from '../lib/firebase/calculations';
import { PhotoGallery, ReportImage } from '../components/PhotoGallery/PhotoGallery';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { LogoUpload } from '../components/LogoUpload';
import toast from 'react-hot-toast';

export const Report: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Initialize state with original calculation data if in edit mode
  const { selectedCranes, calculationResults, editMode, originalCalculation } = location.state as {
    selectedCranes: string[];
    calculationResults: {
      buildingHeight: number;
      craneEdgeDistance: number;
      liftRadius: number;
      requiredLoad: number;
      liftTackle: number;
      totalLoad: number;
      boomAngle: number;
      minBoomLength: number;
      minVerticalHeight: number;
    };
    editMode: boolean;
    originalCalculation: any;
  };
  const [projectName, setProjectName] = useState(originalCalculation?.projectName || '');
  const [projectLocation, setProjectLocation] = useState(originalCalculation?.projectLocation || '');
  const [projectDate, setProjectDate] = useState(originalCalculation?.projectDate || new Date().toISOString().split('T')[0]);
  const [ownerLogo, setOwnerLogo] = useState<string | null>(originalCalculation?.ownerLogo || null);
  const [contractorLogo, setContractorLogo] = useState<string | null>(originalCalculation?.contractorLogo || null);
  const [images, setImages] = useState<ReportImage[]>(originalCalculation?.images || []);

  const handleSaveToDashboard = async () => {
    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    setSaving(true);
    try {
      const calculationData = {
        userId: currentUser.uid,
        projectName,
        projectLocation,
        projectDate,
        ownerLogo,
        contractorLogo,
        selectedCranes,
        buildingHeight: calculationResults.buildingHeight,
        craneEdgeDistance: calculationResults.craneEdgeDistance,
        liftRadius: calculationResults.liftRadius,
        requiredLoad: calculationResults.requiredLoad,
        liftTackle: calculationResults.liftTackle,
        totalLoad: calculationResults.totalLoad,
        boomAngle: calculationResults.boomAngle,
        minBoomLength: calculationResults.minBoomLength,
        minVerticalHeight: calculationResults.minVerticalHeight,
        createdAt: editMode ? originalCalculation.createdAt : new Date().toISOString(),
        images,
        id: editMode ? originalCalculation.id : undefined
      };

      await saveCalculation(calculationData);
      
      toast.success(editMode ? 'Calculation updated successfully' : 'Calculation saved to dashboard');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Failed to save calculation:', error);
      toast.error(`Failed to save calculation: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <CollapsibleSection title="Project Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Location
                </label>
                <input
                  type="text"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Date
                </label>
                <input
                  type="date"
                  value={projectDate}
                  onChange={(e) => setProjectDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Company Logos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LogoUpload
                label="Owner Logo"
                onLogoChange={setOwnerLogo}
                logo={ownerLogo}
              />
              <LogoUpload
                label="Contractor Logo"
                onLogoChange={setContractorLogo}
                logo={contractorLogo}
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Photos">
            <PhotoGallery
              images={images}
              onImagesChange={setImages}
            />
          </CollapsibleSection>

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveToDashboard}
              disabled={saving}
              className="px-6 py-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save to Dashboard'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
