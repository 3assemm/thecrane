interface CraneModel {
  id: string;
  manufacturer: string;
  model: string;
  capacity: number;
  minBoomLength: number;
  maxBoomLength: number;
  maxRadius: number;
  minRadius: number;
}

export const cranes: CraneModel[] = [
  // Liebherr
  {
    id: 'ltm-1030',
    manufacturer: 'Liebherr',
    model: 'LTM 1030-2.1',
    capacity: 35,
    minBoomLength: 9.2,
    maxBoomLength: 30,
    maxRadius: 26,
    minRadius: 3
  },
  {
    id: 'ltm-1040',
    manufacturer: 'Liebherr',
    model: 'LTM 1040-2.1',
    capacity: 40,
    minBoomLength: 10.5,
    maxBoomLength: 35,
    maxRadius: 32,
    minRadius: 3
  },
  {
    id: 'ltm-1050',
    manufacturer: 'Liebherr',
    model: 'LTM 1050-4',
    capacity: 50,
    minBoomLength: 10.2,
    maxBoomLength: 38,
    maxRadius: 34,
    minRadius: 3
  },
  {
    id: 'ltm-1055',
    manufacturer: 'Liebherr',
    model: 'LTM 1055-3.2',
    capacity: 55,
    minBoomLength: 10.5,
    maxBoomLength: 40,
    maxRadius: 36,
    minRadius: 3
  },
  {
    id: 'ltm-1060',
    manufacturer: 'Liebherr',
    model: 'LTM 1060-3.1',
    capacity: 60,
    minBoomLength: 11.1,
    maxBoomLength: 42,
    maxRadius: 38,
    minRadius: 3
  },
  {
    id: 'ltm-1070',
    manufacturer: 'Liebherr',
    model: 'LTM 1070-4.2',
    capacity: 70,
    minBoomLength: 11.3,
    maxBoomLength: 44,
    maxRadius: 40,
    minRadius: 3
  },
  {
    id: 'ltm-1090',
    manufacturer: 'Liebherr',
    model: 'LTM 1090-4.2',
    capacity: 90,
    minBoomLength: 11.7,
    maxBoomLength: 50,
    maxRadius: 46,
    minRadius: 3
  },
  {
    id: 'ltm-1100',
    manufacturer: 'Liebherr',
    model: 'LTM 1100-5.2',
    capacity: 100,
    minBoomLength: 12,
    maxBoomLength: 52,
    maxRadius: 48,
    minRadius: 3
  },

  // Terex
  {
    id: 'rt-35',
    manufacturer: 'Terex',
    model: 'RT 35',
    capacity: 35,
    minBoomLength: 9.1,
    maxBoomLength: 30.1,
    maxRadius: 26,
    minRadius: 3
  },
  {
    id: 'rt-45',
    manufacturer: 'Terex',
    model: 'RT 45',
    capacity: 45,
    minBoomLength: 9.8,
    maxBoomLength: 31.1,
    maxRadius: 28,
    minRadius: 3
  },
  {
    id: 'rt-55',
    manufacturer: 'Terex',
    model: 'RT 55',
    capacity: 55,
    minBoomLength: 10.1,
    maxBoomLength: 34,
    maxRadius: 31,
    minRadius: 3
  },
  {
    id: 'rt-75',
    manufacturer: 'Terex',
    model: 'RT 75',
    capacity: 75,
    minBoomLength: 10.8,
    maxBoomLength: 38,
    maxRadius: 34,
    minRadius: 3
  },
  {
    id: 'rt-100',
    manufacturer: 'Terex',
    model: 'RT 100',
    capacity: 100,
    minBoomLength: 12.1,
    maxBoomLength: 47,
    maxRadius: 44,
    minRadius: 3
  },

  // Tadano
  {
    id: 'gr-500ex',
    manufacturer: 'Tadano',
    model: 'GR-500EX',
    capacity: 50,
    minBoomLength: 10.5,
    maxBoomLength: 42,
    maxRadius: 38,
    minRadius: 3
  },
  {
    id: 'gr-600ex',
    manufacturer: 'Tadano',
    model: 'GR-600EX',
    capacity: 60,
    minBoomLength: 10.8,
    maxBoomLength: 43,
    maxRadius: 40,
    minRadius: 3
  },
  {
    id: 'gr-700ex',
    manufacturer: 'Tadano',
    model: 'GR-700EX',
    capacity: 70,
    minBoomLength: 11.2,
    maxBoomLength: 44,
    maxRadius: 41,
    minRadius: 3
  },
  {
    id: 'gr-800ex',
    manufacturer: 'Tadano',
    model: 'GR-800EX',
    capacity: 80,
    minBoomLength: 11.5,
    maxBoomLength: 46,
    maxRadius: 43,
    minRadius: 3
  },
  {
    id: 'gr-1000ex',
    manufacturer: 'Tadano',
    model: 'GR-1000EX',
    capacity: 100,
    minBoomLength: 12,
    maxBoomLength: 51,
    maxRadius: 47,
    minRadius: 3
  },

  // Grove
  {
    id: 'gmk3050-1',
    manufacturer: 'Grove',
    model: 'GMK3050-1',
    capacity: 50,
    minBoomLength: 10.2,
    maxBoomLength: 40,
    maxRadius: 36,
    minRadius: 3
  },
  {
    id: 'gmk3060',
    manufacturer: 'Grove',
    model: 'GMK3060',
    capacity: 60,
    minBoomLength: 10.5,
    maxBoomLength: 43,
    maxRadius: 40,
    minRadius: 3
  },
  {
    id: 'gmk4075',
    manufacturer: 'Grove',
    model: 'GMK4075',
    capacity: 75,
    minBoomLength: 11,
    maxBoomLength: 45,
    maxRadius: 42,
    minRadius: 3
  },
  {
    id: 'gmk4100b',
    manufacturer: 'Grove',
    model: 'GMK4100B',
    capacity: 100,
    minBoomLength: 11.8,
    maxBoomLength: 52,
    maxRadius: 48,
    minRadius: 3
  },

  // Demag
  {
    id: 'ac-40-2',
    manufacturer: 'Demag',
    model: 'AC 40/2',
    capacity: 40,
    minBoomLength: 9.5,
    maxBoomLength: 37.4,
    maxRadius: 34,
    minRadius: 3
  },
  {
    id: 'ac-50-1',
    manufacturer: 'Demag',
    model: 'AC 50-1',
    capacity: 50,
    minBoomLength: 10.1,
    maxBoomLength: 40,
    maxRadius: 36,
    minRadius: 3
  },
  {
    id: 'ac-60-3',
    manufacturer: 'Demag',
    model: 'AC 60-3',
    capacity: 60,
    minBoomLength: 10.5,
    maxBoomLength: 44,
    maxRadius: 40,
    minRadius: 3
  },
  {
    id: 'ac-80-2',
    manufacturer: 'Demag',
    model: 'AC 80-2',
    capacity: 80,
    minBoomLength: 11.3,
    maxBoomLength: 50,
    maxRadius: 46,
    minRadius: 3
  },
  {
    id: 'ac-100',
    manufacturer: 'Demag',
    model: 'AC 100',
    capacity: 100,
    minBoomLength: 12.1,
    maxBoomLength: 50.1,
    maxRadius: 48,
    minRadius: 3
  }
];

export const filterSuitableCranes = (
  totalLoad: number,
  minBoomLength: number,
  liftRadius: number
): CraneModel[] => {
  return cranes.filter(crane => 
    crane.capacity >= totalLoad &&
    crane.maxBoomLength >= minBoomLength &&
    crane.maxRadius >= liftRadius &&
    crane.minRadius <= liftRadius
  );
};
