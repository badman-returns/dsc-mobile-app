import React, { useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/components/SplashScreen';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { PlatformBridge } from './src/services/platformBridge';
import { PaymentService } from './src/services/paymentService';
import { getWebUrl, isDevelopment } from './src/config/environment';
import { createViewportMeta } from './src/utils/webview';
import { APP_CONFIG, PAYMENT_MESSAGE_TYPES } from './src/constants/app';
import { COLORS } from './src/constants/colors';
import logger from './src/utils/logger';
import {
  PaymentRequestPayload,
  PaymentMessage,
} from './src/types/payment';

const WEB_URL = getWebUrl();

if (isDevelopment()) {
  logger.info('Loading WebView with URL:', WEB_URL);
}

export default function App() {
  const { isReady } = useAppInitialization();
  const webViewRef = useRef<WebView>(null);
  const previousUrlRef = useRef<string>(WEB_URL);

  if (!isReady) {
    return <SplashScreen />;
  }

  const handleWebViewLoad = () => {
    PlatformBridge.sendPlatformInfo(webViewRef);
  };

  const handleWebViewError = (syntheticEvent: any) => {
    logger.error('WebView error:', syntheticEvent.nativeEvent);
  };

  const handleNavigationStateChange = (navState: any) => {
    const newUrl = navState.url;
    
    if (previousUrlRef.current !== WEB_URL && previousUrlRef.current !== newUrl) {
      logger.info('Reloading page to ensure fresh content:', newUrl);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          window.location.reload(true);
          true;
        `);
      }
    }
    
    previousUrlRef.current = newUrl;
  };

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'CONSOLE_LOG') {
        return;
      }


      if (data.type === PAYMENT_MESSAGE_TYPES.PAYMENT_REQUEST) {
        const paymentData = data as PaymentMessage;
        const result = await PaymentService.processPayment(
          paymentData.payload as PaymentRequestPayload
        );

        const responseMessage = {
          type: 'razorpay_payment_id' in result 
            ? PAYMENT_MESSAGE_TYPES.PAYMENT_SUCCESS 
            : PAYMENT_MESSAGE_TYPES.PAYMENT_FAILURE,
          payload: result,
        };

        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify(responseMessage));
        }
      }
    } catch (error) {
      logger.error('Error handling WebView message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_URL }}
        style={styles.webview}
        startInLoadingState
        injectedJavaScript={createViewportMeta()}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={handleNavigationStateChange}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Image
              source={require('./assets/loading.gif')}
              style={styles.loadingImage}
              resizeMode="contain"
            />
          </View>
        )}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        onHttpError={(syntheticEvent) => {
          logger.error('HTTP Error:', syntheticEvent.nativeEvent);
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={true}
        bounces={false}
        overScrollMode="always"
        nestedScrollEnabled={true}
        webviewDebuggingEnabled={isDevelopment()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingImage: {
    width: APP_CONFIG.LOADING_ICON_SIZE,
    height: APP_CONFIG.LOADING_ICON_SIZE,
  },
});
