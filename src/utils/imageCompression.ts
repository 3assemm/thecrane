import imageCompression from 'browser-image-compression';

/**
 * @file imageCompression.ts
 *
 * @description This file contains the `compressImage` function, which compresses an image file using the `browser-image-compression` library.
 *
 * @module imageCompression
 */

// Interface for the compression options
interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
}

/**
 * Compresses an image file.
 *
 * @param {File} file - The image file to compress.
 * @param {CompressionOptions} options - The compression options.
 * @param {number} options.maxSizeMB - The maximum size of the compressed image in MB.
 * @param {number} options.maxWidthOrHeight - The maximum width or height of the compressed image.
 * @returns {Promise<File>} A promise that resolves with the compressed image file.
 * @throws {Error} If the image file is not an image or if it exceeds the size limit.
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  }
): Promise<File> => {
  try {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} is not an image file`);
    }

    // Check if the file size exceeds the limit
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name} exceeds 5MB size limit`);
    }

    // Compress the image using the browser-image-compression library
    return await imageCompression(file, {
      ...options,
      useWebWorker: true,
      preserveExif: true,
    });
  } catch (error: any) {
    console.error('Error compressing image:', error);
    toast.error(`Failed to compress image: ${error.message}`);
    throw error;
  }
};
