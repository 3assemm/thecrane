export interface UserPreferences {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  role: 'free' | 'premium' | 'admin';
  defaultUnits: 'metric' | 'imperial';
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface UserStats {
  userId: string;
  totalCalculations: number;
  existingCalculations: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  role: 'free' | 'premium' | 'admin';
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
  totalCalculations: number;
  existingCalculations: number;
}
