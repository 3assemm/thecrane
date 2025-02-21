import QRCode from 'qrcode';
import jsQR from 'jsqr';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 340; // Extra height for the text

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Generate QR code with custom color
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Create a temporary image to draw the QR code
    const qrImage = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load QR code image'));
      img.src = qrDataUrl;
    });

    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code centered horizontally
    const qrX = (canvas.width - qrImage.width) / 2;
    ctx.drawImage(qrImage, qrX, 10);

    // Get the image data
    const imageData = ctx.getImageData(qrX, 10, qrImage.width, qrImage.height);
    const data = imageData.data;

    // Create gradient colors
    const gradient = ctx.createLinearGradient(qrX, 10, qrX + qrImage.width, qrImage.height + 10);
    gradient.addColorStop(0, '#f97316'); // Orange-500
    gradient.addColorStop(1, '#000000'); // Black

    // Apply gradient to black pixels
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
        const x = ((i / 4) % qrImage.width) / qrImage.width;
        const y = Math.floor((i / 4) / qrImage.width) / qrImage.height;
        
        // Get color from gradient
        ctx.fillStyle = gradient;
        ctx.fillRect(qrX + ((i / 4) % qrImage.width), 10 + Math.floor((i / 4) / qrImage.width), 1, 1);
      }
    }

    try {
      // Load and draw the logo in the center
      const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load logo'));
        img.crossOrigin = 'anonymous'; // Enable cross-origin image loading
        img.src = '/crane-logo.png';
      });

      // Calculate logo size (25% of QR code size)
      const logoSize = qrImage.width * 0.25;
      const logoX = qrX + (qrImage.width - logoSize) / 2;
      const logoY = 10 + (qrImage.height - logoSize) / 2;

      // Draw white background for logo
      ctx.fillStyle = 'white';
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

      // Draw logo
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    } catch (logoError) {
      console.warn('Failed to load logo, continuing without it:', logoError);
    }

    // Add text below QR code
    ctx.fillStyle = '#f97316'; // Orange text
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NPCrane.com', canvas.width / 2, canvas.height - 20);

    return canvas.toDataURL('image/png');
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    toast.error(`Failed to generate QR code: ${error.message}`);
    throw new Error('Failed to generate QR code');
  }
};

export const downloadQRCode = async (id: string, filename: string) => {
  try {
    const qrDataUrl = await generateQRCode(id);
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('Error downloading QR code:', error);
    toast.error(`Failed to download QR code: ${error.message}`);
  }
};

export const readQRCodeFromImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        resolve(code.data);
      } else {
        reject(new Error('No QR code found in image'));
      }
    };

    img.onerror = () => {
      console.error('Error loading image for QR code reading');
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
};
