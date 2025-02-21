import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Calculation } from '../types/calculation';

const createPDFContent = (calculation: Calculation): HTMLDivElement => {
  const element = document.createElement('div');
  element.style.padding = '20px';
  element.style.fontFamily = 'Arial, sans-serif';
  
  element.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Crane Calculation Report</h1>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Project Details</h2>
        <p style="margin: 5px 0;"><strong>Project Name:</strong> ${calculation.projectName}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${calculation.projectLocation}</p>
        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(calculation.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Calculation Results</h2>
        <p style="margin: 5px 0;"><strong>Total Load:</strong> ${calculation.totalLoad}T</p>
        <p style="margin: 5px 0;"><strong>Boom Angle:</strong> ${calculation.boomAngle}°</p>
        <p style="margin: 5px 0;"><strong>Min Boom Length:</strong> ${calculation.minBoomLength}m</p>
        <p style="margin: 5px 0;"><strong>Building Height:</strong> ${calculation.buildingHeight}m</p>
        <p style="margin: 5px 0;"><strong>Crane Edge Distance:</strong> ${calculation.craneEdgeDistance}m</p>
        <p style="margin: 5px 0;"><strong>Lift Radius:</strong> ${calculation.liftRadius}m</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Selected Cranes</h2>
        <ul style="margin: 0; padding-left: 20px;">
          ${calculation.selectedCranes.map(crane => `<li style="margin: 5px 0;">${crane}</li>`).join('')}
        </ul>
      </div>

      ${calculation.images?.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #666; font-size: 18px; margin-bottom: 10px;">Photos</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            ${calculation.images.map(image => `
              <div>
                <img 
                  src="${image.url}" 
                  alt="${image.caption || 'Report image'}"
                  style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
                />
                ${image.caption ? `
                  <p style="margin-top: 8px; color: #666; font-size: 14px;">
                    ${image.caption}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  return element;
};

export const generatePDF = async (calculation: Calculation): Promise<void> => {
  try {
    // Create the styled content
    const element = createPDFContent(calculation);
    document.body.appendChild(element);

    // Configure html2canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Remove the temporary element
    document.body.removeChild(element);

    // Configure PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${calculation.projectName}-calculation-report.pdf`);

    return Promise.resolve();
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return Promise.reject(new Error('Failed to generate PDF'));
  }
};
