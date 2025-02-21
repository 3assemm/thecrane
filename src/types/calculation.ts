import { ReportImage } from '../components/PhotoGallery/PhotoGallery';

export interface Calculation {
  id?: string;
  userId: string;
  projectName: string;
  projectLocation: string;
  projectDate: string;
  ownerLogo: string | null;
  contractorLogo: string | null;
  selectedCranes: string[];
  buildingHeight: number;
  craneEdgeDistance: number;
  liftRadius: number;
  requiredLoad: number;
  liftTackle: number;
  totalLoad: number;
  boomAngle: number;
  minBoomLength: number;
  minVerticalHeight: number;
  createdAt: string;
  isPublic?: boolean;
  images: ReportImage[];
}
