import React from 'react';
import QrScanner from 'react-qr-scanner';

interface QrReaderProps {
  onScan: (data: { text: string } | null) => void;
  onError: (error: Error) => void;
  constraints?: MediaTrackConstraints;
  className?: string;
}

export const QrReader: React.FC<QrReaderProps> = ({ 
  onScan, 
  onError,
  constraints = { facingMode: 'environment' },
  className = "w-full h-full"
}) => {
  return (
    <QrScanner
      onError={onError}
      onScan={onScan}
      constraints={{ video: constraints }}
      className={className}
      style={{ width: '100%' }}
    />
  );
};
