import { toast } from 'react-hot-toast';

export const handleQrScannerError = (error: Error): void => {
  console.error('QR Scanner Error:', error);

  if (error.name === 'NotAllowedError') {
    toast.error('Camera access denied. Please enable camera permissions.');
  } else if (error.name === 'NotFoundError') {
    toast.error('No camera found. Please ensure your device has a camera.');
  } else {
    toast.error(`Failed to initialize camera: ${error.message}`);
  }
};
