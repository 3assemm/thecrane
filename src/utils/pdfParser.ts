import { PDFDocument } from 'pdf-lib';

interface LoadChartPoint {
  radius: number;
  angle: number;
  capacity: number;
  boomLength: number;
}

export const extractLoadChartFromPDF = async (pdfFile: File): Promise<LoadChartPoint[]> => {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const loadChart: LoadChartPoint[] = [];

    for (const page of pages) {
      const text = await page.getText();
      const lines = text.split('\n');

      for (const line of lines) {
        // Try to extract load chart data from each line
        const dataPoint = parseLoadChartLine(line);
        if (dataPoint) {
          loadChart.push(dataPoint);
        }
      }
    }

    return loadChart;
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    toast.error(`Failed to parse PDF file: ${error.message}`);
    throw new Error('Failed to parse PDF file');
  }
};

const parseLoadChartLine = (line: string): LoadChartPoint | null => {
  // Remove multiple spaces and trim
  const cleanLine = line.replace(/\s+/g, ' ').trim();
  
  // Try to match numbers in the line
  const numbers = cleanLine.match(/\d+\.?\d*/g);
  
  if (numbers && numbers.length >= 4) {
    // Assuming the format is: radius angle capacity boomLength
    return {
      radius: parseFloat(numbers[0]),
      angle: parseFloat(numbers[1]),
      capacity: parseFloat(numbers[2]),
      boomLength: parseFloat(numbers[3])
    };
  }
  
  return null;
};

export const convertToCSV = (loadChart: LoadChartPoint[]): string => {
  const headers = ['radius,angle,capacity,boomLength'];
  const rows = loadChart.map(point => 
    `${point.radius},${point.angle},${point.capacity},${point.boomLength}`
  );
  
  return [...headers, ...rows].join('\n');
};
