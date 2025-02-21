import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, deleteObject, getDownloadURL } from 'firebase/storage';
import { compressImage } from '../../utils/imageCompression';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

/**
 * @file PhotoGallery.tsx
 *
 * @description This file contains the `PhotoGallery` component, which allows users to upload,
 * preview, and delete images. It also provides functionality to add captions to images.
 *
 * @module PhotoGallery
 */

// Interface for the ReportImage object
export interface ReportImage {
  id: string;
  url: string;
  caption: string;
  fileName: string;
}

// Interface for the PhotoGallery component props
interface PhotoGalleryProps {
  images: ReportImage[];
  onImagesChange: (images: ReportImage[]) => void;
}

/**
 * PhotoGallery component - allows users to upload, preview, and delete images.
 *
 * @param {PhotoGalleryProps} props - The component props.
 * @param {ReportImage[]} props.images - The array of images to display.
 * @param {(images: ReportImage[]) => void} props.onImagesChange - Function to call when the images are changed.
 * @returns {React.ReactElement} The PhotoGallery component.
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, onImagesChange }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the file selection.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed per report');
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB size limit`);
        }

        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920
        });

        const imageId = uuidv4();
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `temp/${currentUser.uid}/images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
          }
        );

        await uploadTask;
        const downloadUrl = await getDownloadURL(storageRef);

        return {
          id: imageId,
          url: downloadUrl,
          caption: '',
          fileName
        };
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    const newImages = (await Promise.all(uploadPromises)).filter((img): img is ReportImage => img !== null);
    onImagesChange([...images, ...newImages]);
    setUploading(false);
    setUploadProgress({});
  };

  /**
   * Handles the deletion of an image.
   *
   * @param {ReportImage} image - The image to delete.
   */
  const handleDelete = async (image: ReportImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const imageRef = ref(storage, `temp/${currentUser.uid}/images/${image.fileName}`);
      await deleteObject(imageRef);
      onImagesChange(images.filter(img => img.id !== image.id));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  /**
   * Handles the change of an image caption.
   *
   * @param {string} imageId - The ID of the image to update.
   * @param {string} caption - The new caption.
   */
  const handleCaptionChange = (imageId: string, caption: string) => {
    if (caption.length > 100) return;
    onImagesChange(
      images.map(img => 
        img.id === imageId ? { ...img, caption } : img
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold dark:text-white">Photos</h3>
        {/* Button to trigger file input */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= 10}
          className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Add Photos
        </button>
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map(image => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Image preview */}
              <img
                src={image.url}
                alt={image.caption || 'Uploaded image'}
                className="w-full h-48 object-cover rounded-lg"
              />
              {/* Caption input */}
              <input
                type="text"
                value={image.caption}
                onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                placeholder="Add a caption..."
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700 dark:text-white"
                maxLength={100}
              />
              {/* Delete button */}
              <button
                onClick={() => handleDelete(image)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mt-4">
          <h4 className="text-md font-semibold dark:text-white mb-2">Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                className="bg-yellow-400 h-2.5 rounded-full"
              ></motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
