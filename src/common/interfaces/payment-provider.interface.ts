export interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
  customerId?: string;
  customerEmail?: string;
}

export interface PaymentOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: 'razorpay' | 'stripe';
  clientSecret?: string;
  keyId?: string;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature?: string;
}

export interface VerifyPaymentResult {
  isSuccess: boolean;
  paymentId: string;
  orderId: string;
  amount?: number;
  method?: string;
  raw?: any;
}

export interface PaymentProviderInterface {
  createPayment(params: CreateOrderParams): Promise<PaymentOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  refundPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string }>;
  handleWebhook(rawBody: any, signature: string): Promise<{ event: string; data: any }>;
}
