export const APP_CONFIG = {
  NAME: 'Dil Say Care',
  BUNDLE_ID: 'com.dilsaycare.mobile',
  VERSION: '1.0.0',
  SPLASH_DELAY_MS: 100,
  LOADING_ICON_SIZE: 240,
} as const;

export const WEB_URLS = {
  LOCAL: 'http://192.168.31.13:5173',
  STAGING: 'https://dev.dilsaycare.in',
  PRODUCTION: 'https://dilsaycare.in',
} as const;

export const PLATFORM_MESSAGE_TYPES = {
  PLATFORM_INFO: 'PLATFORM_INFO',
} as const;

export const PAYMENT_MESSAGE_TYPES = {
  PAYMENT_REQUEST: 'PAYMENT_REQUEST',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILURE: 'PAYMENT_FAILURE',
} as const;
