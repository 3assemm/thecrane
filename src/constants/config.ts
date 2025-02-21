export const APP_CONFIG = {
  APP_NAME: 'NPCrane.com',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'ar'] as const,
  ADMIN_EMAIL: '3assem@gmail.com',
  UNITS: {
    METRIC: 'metric',
    IMPERIAL: 'imperial'
  },
  ROLES: {
    FREE: 'free',
    PREMIUM: 'premium',
    ADMIN: 'admin'
  },
  FREE_TIER_LIMIT: 10
} as const;
