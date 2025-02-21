export interface CraneModel {
  craneId: string;
  manufacturer: string;
  model: string;
  capacity: number;
  specifications: {
    maxCapacity: number;
    minBoomLength: number;
    maxBoomLength: number;
    maxRadius: number;
    minRadius: number;
  };
  searchableCapacity: number;
  searchableRadius: number;
  searchableBoomLength: number;
}

export interface LoadChartPoint {
  radius: number;
  capacity: number;
  boomLength: number;
}

export interface CraneLoadChart {
  craneId: string;
  points: LoadChartPoint[];
  updatedAt: string;
  createdBy: string;
}
