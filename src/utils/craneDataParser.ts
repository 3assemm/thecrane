import Papa from 'papaparse';
import { CraneModel, CraneLoadChart, LoadChartPoint, updateCraneModel, updateCraneLoadChart } from '../lib/firebase';
import toast from 'react-hot-toast';

interface RawLoadChartRow {
  radius: string;
  capacity: string;
  boomlength: string;
}

export const parseCraneData = async (csvData: string, craneInfo: {
  manufacturer: string;
  model: string;
  capacity: number;
}): Promise<{ model: CraneModel; loadChart: CraneLoadChart }> => {
  return new Promise((resolve, reject) => {
    try {
      const cleanData = csvData
        .replace(/^\uFEFF/, '') // Remove BOM
        .replace(/\r\n/g, '\n') // Normalize line endings
        .trim();

      if (!cleanData) {
        throw new Error('CSV file is empty');
      }

      Papa.parse<RawLoadChartRow>(cleanData, {
        header: true,
        skipEmptyLines: 'greedy',
        transformHeader: (header) => header.trim().toLowerCase(),
        transform: (value) => value.trim(),
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              throw new Error('No data found in the CSV file');
            }

            // Validate headers
            const headers = Object.keys(results.data[0]);
            const requiredHeaders = ['radius', 'capacity', 'boomlength'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
            
            if (missingHeaders.length > 0) {
              throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
            }

            const points: LoadChartPoint[] = [];
            const uniquePoints = new Set<string>();

            let maxRadius = 0;
            let minRadius = Infinity;
            let maxBoomLength = 0;
            let minBoomLength = Infinity;

            for (const row of results.data) {
              // Skip empty rows
              if (!row.radius || !row.capacity || !row.boomlength) {
                continue;
              }

              const radius = parseFloat(row.radius);
              const capacity = parseFloat(row.capacity);
              const boomLength = parseFloat(row.boomlength);

              // Validate numbers
              if (isNaN(radius) || isNaN(capacity) || isNaN(boomLength)) {
                continue;
              }

              if (radius <= 0 || capacity <= 0 || boomLength <= 0) {
                continue;
              }

              const key = `${radius}-${capacity}-${boomLength}`;
              if (!uniquePoints.has(key)) {
                uniquePoints.add(key);
                points.push({ radius, capacity, boomLength });

                // Update min/max values
                maxRadius = Math.max(maxRadius, radius);
                minRadius = Math.min(minRadius, radius);
                maxBoomLength = Math.max(maxBoomLength, boomLength);
                minBoomLength = Math.min(minBoomLength, boomLength);
              }
            }

            if (points.length === 0) {
              throw new Error('No valid data points found in the CSV file');
            }

            // Sort points by radius and boom length
            points.sort((a, b) => 
              a.boomLength === b.boomLength 
                ? a.radius - b.radius 
                : a.boomLength - b.boomLength
            );

            const craneId = `${craneInfo.manufacturer.toLowerCase()}-${craneInfo.model.toLowerCase()}`
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');

            const model: Omit<CraneModel, 'createdBy' | 'updatedAt'> = {
              craneId,
              manufacturer: craneInfo.manufacturer,
              model: craneInfo.model,
              capacity: craneInfo.capacity,
              specifications: {
                maxCapacity: craneInfo.capacity,
                minBoomLength,
                maxBoomLength,
                maxRadius,
                minRadius
              }
            };

            const loadChart: Omit<CraneLoadChart, 'createdBy' | 'updatedAt'> = {
              craneId,
              points
            };

            resolve({ 
              model: model as CraneModel, 
              loadChart: loadChart as CraneLoadChart 
            });
          } catch (error: any) {
            console.error('Error parsing CSV data:', error);
            reject(new Error(`Failed to parse CSV data: ${error.message}`));
          }
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error);
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      });
    } catch (error: any) {
      console.error('Error processing CSV file:', error);
      reject(new Error(`Failed to process CSV file: ${error.message}`));
    }
  });
};
