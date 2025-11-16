export interface PlatformInfo {
  isReactNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  os: 'ios' | 'android';
}

export interface PlatformMessage {
  type: string;
  payload: PlatformInfo;
}
