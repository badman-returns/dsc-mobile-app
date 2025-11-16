import React, { useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from './src/components/SplashScreen';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { PlatformBridge } from './src/services/platformBridge';
import { getWebUrl, isDevelopment } from './src/config/environment';
import { createViewportMeta } from './src/utils/webview';
import { APP_CONFIG } from './src/constants/app';
import { COLORS } from './src/constants/colors';
import logger from './src/utils/logger';

const WEB_URL = getWebUrl();

if (isDevelopment()) {
  logger.info('Loading WebView with URL:', WEB_URL);
}

export default function App() {
  const { isReady } = useAppInitialization();
  const webViewRef = useRef<WebView>(null);

  if (!isReady) {
    return <SplashScreen />;
  }

  const handleWebViewLoad = () => {
    logger.success('WebView loaded successfully');
    PlatformBridge.sendPlatformInfo(webViewRef);
  };

  const handleWebViewError = (syntheticEvent: any) => {
    logger.error('WebView error:', syntheticEvent.nativeEvent);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'CONSOLE_LOG') {
        logger.info('[WebView Console]:', data.message);
      }
    } catch (error) {
      logger.debug('WebView message:', event.nativeEvent.data);
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
        onLoadStart={() => logger.info('WebView starting to load...')}
        onLoadProgress={({ nativeEvent }) => {
          if (isDevelopment()) {
            logger.debug(`WebView loading: ${Math.round(nativeEvent.progress * 100)}%`);
          }
        }}
        onHttpError={(syntheticEvent) => {
          logger.error('HTTP Error:', syntheticEvent.nativeEvent);
        }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        contentInsetAdjustmentBehavior="never"
        scrollEnabled
        bounces={false}
        overScrollMode="never"
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
