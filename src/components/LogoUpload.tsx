import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';

/**
 * @file LogoUpload.tsx
 *
 * @description This file contains the `LogoUpload` component, which allows users to upload a logo image.
 * It provides a preview of the uploaded image and an option to remove it.
 *
 * @module LogoUpload
 */

// Interface for the LogoUpload component props
interface LogoUploadProps {
  label: string;
  onLogoChange: (logo: string | null) => void;
  logo: string | null;
}

/**
 * LogoUpload component - allows users to upload a logo image.
 *
 * @param {LogoUploadProps} props - The component props.
 * @param {string} props.label - The label for the logo upload area.
 * @param {(logo: string | null) => void} props.onLogoChange - Function to call when the logo is changed.
 * @param {string | null} props.logo - The current logo URL or null if no logo is uploaded.
 * @returns {React.ReactElement} The LogoUpload component.
 */
export const LogoUpload: React.FC<LogoUploadProps> = ({ label, onLogoChange, logo }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the file selection.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles the removal of the current logo.
   */
  const handleRemoveLogo = () => {
    onLogoChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <div className="flex items-center gap-4">
        {/* Display the current logo or an upload button */}
        {logo ? (
          <div className="relative">
            <img src={logo} alt="Uploaded logo" className="w-24 h-24 object-cover rounded-md" />
            {/* Remove logo button */}
            <button
              onClick={handleRemoveLogo}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Logo
          </motion.button>
        )}
      </div>
    </div>
  );
};
