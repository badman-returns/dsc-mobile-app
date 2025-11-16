import { WebView } from 'react-native-webview';

export type WebViewRef = React.RefObject<WebView>;

export interface WebViewConfig {
  uri: string;
  javaScriptEnabled: boolean;
  domStorageEnabled: boolean;
  sharedCookiesEnabled: boolean;
  thirdPartyCookiesEnabled: boolean;
  scrollEnabled: boolean;
  bounces: boolean;
  overScrollMode: 'never' | 'always' | 'content';
  webviewDebuggingEnabled: boolean;
}
