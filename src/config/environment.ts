import Constants from 'expo-constants';
import { WEB_URLS } from '../constants/app';

export const getWebUrl = (): string => {
  return Constants.expoConfig?.extra?.WEB_URL || WEB_URLS.STAGING;
};

export const isDevelopment = (): boolean => {
  return __DEV__;
};

export const isProduction = (): boolean => {
  return !__DEV__;
};
