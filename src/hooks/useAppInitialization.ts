import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { APP_CONFIG } from '../constants/app';
import logger from '../utils/logger';

SplashScreen.preventAutoHideAsync();

export const useAppInitialization = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.SPLASH_DELAY_MS));
        setIsReady(true);
      } catch (error) {
        logger.error('App initialization failed', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initialize();
  }, []);

  return { isReady };
};
