export interface PaymentUserInfo {
  name: string;
  email: string;
  contact: string;
}

export interface PaymentMetadata {
  doctorName: string;
  sessionDate: string;
  sessionTime: string;
}

export interface PaymentRequestPayload {
  orderId: string;
  amount: number;
  currency: string;
  userInfo: PaymentUserInfo;
  metadata: PaymentMetadata;
  apiBaseUrl: string;
  razorpayKeyId: string;
}

export interface PaymentSuccessPayload {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface PaymentFailurePayload {
  orderId: string;
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  };
}

export interface PaymentMessage {
  type: 'PAYMENT_REQUEST' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILURE';
  payload: PaymentRequestPayload | PaymentSuccessPayload | PaymentFailurePayload;
}
