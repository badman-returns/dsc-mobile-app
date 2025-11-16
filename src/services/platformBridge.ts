import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { PLATFORM_MESSAGE_TYPES } from '../constants/app';
import { PlatformMessage } from '../types/platform';
import logger from '../utils/logger';

export class PlatformBridge {
  static sendPlatformInfo(webViewRef: React.RefObject<WebView>): void {
    if (!webViewRef.current) {
      logger.warning('WebView ref not available');
      return;
    }

    const message: PlatformMessage = {
      type: PLATFORM_MESSAGE_TYPES.PLATFORM_INFO,
      payload: {
        isReactNative: true,
        isIOS: Platform.OS === 'ios',
        isAndroid: Platform.OS === 'android',
        os: Platform.OS as 'ios' | 'android',
      },
    };

    try {
      webViewRef.current.postMessage(JSON.stringify(message));
      logger.success('Platform info sent to web', message.payload);
    } catch (error) {
      logger.error('Failed to send platform info', error);
    }
  }
}
