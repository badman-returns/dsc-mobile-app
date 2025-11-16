import {
  PaymentRequestPayload,
  PaymentSuccessPayload,
  PaymentFailurePayload,
} from '../types/payment';
import logger from '../utils/logger';
import { loadImageAsBase64 } from '../utils/imageLoader';

import Constants from 'expo-constants';

// For Expo compatibility - will use WebView-based Razorpay
// Native module (react-native-razorpay) only works in EAS/standalone builds
let RazorpayCheckout: any = null;

try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch (error) {
  logger.warning('Native Razorpay module not available, will use WebView fallback');
}

export class PaymentService {
  /**
   * Check if native Razorpay is available
   * Native Razorpay only works in EAS builds (not Expo Go)
   */
  private static isNativeRazorpayAvailable(): boolean {
    // In Expo Go, native modules don't work properly
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      logger.info('Running in Expo Go, using WebView payment');
      return false;
    }

    const isAvailable = !!(RazorpayCheckout && typeof RazorpayCheckout.open === 'function');
    logger.info('Native Razorpay check', { 
      isExpoGo,
      hasModule: !!RazorpayCheckout,
      hasOpenMethod: !!(RazorpayCheckout && typeof RazorpayCheckout.open === 'function'),
      isAvailable 
    });
    return isAvailable;
  }

  /**
   * Initialize Razorpay payment
   */
  static async processPayment(
    payload: PaymentRequestPayload
  ): Promise<PaymentSuccessPayload | PaymentFailurePayload> {
    // If native module is not available (Expo Go), return error to fallback to WebView
    if (!this.isNativeRazorpayAvailable()) {
      logger.warning('Native Razorpay not available, use WebView payment flow');
      return {
        orderId: payload.orderId,
        error: {
          code: 'NATIVE_MODULE_UNAVAILABLE',
          description: 'Please use WebView payment flow',
          source: 'payment_service',
          step: 'initialization',
          reason: 'Native module not available in Expo Go',
        },
      };
    }

    try {
      // Load logo as base64
      const logoBase64 = await loadImageAsBase64(
        require('../../assets/dilsaycare.png')
      );

      const options = {
        description: `Session with ${payload.metadata.doctorName}`,
        currency: payload.currency,
        key: payload.razorpayKeyId,
        amount: payload.amount * 100, // Amount in paise
        name: 'DilSayCare',
        order_id: payload.orderId,
        prefill: {
          email: payload.userInfo.email,
          contact: payload.userInfo.contact,
          name: payload.userInfo.name,
        },
        theme: { color: '#5956FC' },
        method: {
          upi: true,
          card: true,
          wallet: true,
          netbanking: true,
        },
        ...(logoBase64 && { image: logoBase64 }), // Add logo if loaded successfully
      };

      logger.info('🎯 Using NATIVE Razorpay SDK', { 
        orderId: payload.orderId,
        platform: 'native',
        hasLogo: !!logoBase64 
      });

      // Double-check before calling
      if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
        throw new Error('Razorpay native module not properly initialized');
      }

      const data = await RazorpayCheckout.open(options);

      logger.success('Payment successful', data);

      // Verify payment with backend
      await this.verifyPayment(
        payload.apiBaseUrl,
        payload.orderId,
        data.razorpay_payment_id,
        data.razorpay_order_id,
        data.razorpay_signature
      );

      return {
        orderId: payload.orderId,
        razorpayPaymentId: data.razorpay_payment_id,
        razorpayOrderId: data.razorpay_order_id,
        razorpaySignature: data.razorpay_signature,
      };
    } catch (error: any) {
      logger.error('Payment failed', error);

      return {
        orderId: payload.orderId,
        error: {
          code: error.code || 'PAYMENT_ERROR',
          description: error.description || 'Payment processing failed',
          source: error.source || 'unknown',
          step: error.step || 'payment_init',
          reason: error.reason || 'Unknown error occurred',
        },
      };
    }
  }

  /**
   * Verify payment with backend
   */
  private static async verifyPayment(
    apiBaseUrl: string,
    orderId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<void> {
    try {
      const verifyUrl = `${apiBaseUrl}/api/v1/payment/verify`;

      logger.info('Verifying payment with backend', { orderId });

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          status: 'confirmed',
        }),
        credentials: 'include', // Include cookies for auth
      });

      if (!response.ok) {
        throw new Error(`Verification failed with status: ${response.status}`);
      }

      const result = await response.json();
      logger.success('Payment verified successfully', result);
    } catch (error) {
      logger.error('Payment verification failed', error);
      throw error;
    }
  }
}
