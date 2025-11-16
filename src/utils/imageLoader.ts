import { Asset } from 'expo-asset';

/**
 * Load a local image URI for Razorpay
 * In Expo Go: Returns null (will skip logo)
 * In Built App: Can use Asset URI directly
 */
export async function loadImageAsBase64(imageModule: any): Promise<string | null> {
  try {
    // Try to load FileSystem module (only available in built apps)
    const FileSystem = require('expo-file-system');
    
    // Load the asset
    const asset = Asset.fromModule(imageModule);
    await asset.downloadAsync();

    if (!asset.localUri) {
      return null;
    }

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Return with proper data URI format
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    // FileSystem not available (Expo Go) - skip logo
    console.log('Logo not available in Expo Go, will be shown in built app');
    return null;
  }
}
