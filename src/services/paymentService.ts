import {
  PaymentRequestPayload,
  PaymentSuccessPayload,
  PaymentFailurePayload,
} from '../types/payment';
import logger from '../utils/logger';
import { loadImageAsBase64 } from '../utils/imageLoader';

import Constants from 'expo-constants';

let RazorpayCheckout: any = null;

try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch (error) {
}

export class PaymentService {
  private static isNativeRazorpayAvailable(): boolean {
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      return false;
    }

    return !!(RazorpayCheckout && typeof RazorpayCheckout.open === 'function');
  }

  static async processPayment(
    payload: PaymentRequestPayload
  ): Promise<PaymentSuccessPayload | PaymentFailurePayload> {
    if (!this.isNativeRazorpayAvailable()) {
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
      const logoBase64 = await loadImageAsBase64(
        require('../../assets/dilsaycare.png')
      );

      const options = {
        description: `Session with ${payload.metadata.doctorName}`,
        currency: payload.currency,
        key: payload.razorpayKeyId,
        amount: payload.amount * 100,
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
        ...(logoBase64 && { image: logoBase64 }),
      };

      if (!RazorpayCheckout || typeof RazorpayCheckout.open === 'function') {
        throw new Error('Razorpay native module not properly initialized');
      }

      const data = await RazorpayCheckout.open(options);

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

  private static async verifyPayment(
    apiBaseUrl: string,
    orderId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string
  ): Promise<void> {
    try {
      const verifyUrl = `${apiBaseUrl}/api/v1/payment/verify`;

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
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Verification failed with status: ${response.status}`);
      }

      await response.json();
    } catch (error) {
      logger.error('Payment verification failed', error);
      throw error;
    }
  }
}
