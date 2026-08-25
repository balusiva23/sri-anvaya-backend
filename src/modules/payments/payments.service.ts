import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { RazorpayProvider } from './razorpay.provider';
import { StripeProvider } from './stripe.provider';
import { PaymentStatus } from '../../schemas/payment.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    private readonly razorpayProvider: RazorpayProvider,
    private readonly stripeProvider: StripeProvider,
  ) {}

  private getProvider(providerName?: string) {
    const activeProvider = (providerName || process.env.PAYMENT_PROVIDER || 'razorpay').toLowerCase();
    return activeProvider === 'stripe' ? this.stripeProvider : this.razorpayProvider;
  }

  async createOrder(userId: string, body: { amount: number; planId?: string; eventId?: string; provider?: string }) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new BadRequestException('Customer record required');

    const providerInstance = this.getProvider(body.provider);
    const receipt = `REC-${Date.now()}`;

    const order = await providerInstance.createPayment({
      amount: body.amount,
      currency: 'INR',
      receipt,
      customerId: customer._id,
      notes: { planId: body.planId, eventId: body.eventId },
    });

    const pendingPayment = {
      _id: `pay_${Date.now()}`,
      paymentId: `PAY-SA-${Date.now().toString().slice(-6)}`,
      customerId: customer._id,
      provider: order.provider,
      providerOrderId: order.orderId,
      amount: body.amount,
      currency: order.currency,
      status: PaymentStatus.PENDING,
      metadata: { planId: body.planId, eventId: body.eventId },
      createdAt: new Date(),
    };
    this.dataStore.payments.push(pendingPayment);

    return {
      order,
      paymentId: pendingPayment.paymentId,
    };
  }

  async verifyPayment(body: { orderId: string; paymentId: string; signature?: string; provider?: string }) {
    const providerInstance = this.getProvider(body.provider);
    const verification = await providerInstance.verifyPayment(body);

    if (!verification.isSuccess) {
      throw new BadRequestException('Payment verification failed');
    }

    // Find and update payment
    const payment = this.dataStore.payments.find(
      (p) => p.providerOrderId === body.orderId || p.paymentId === body.paymentId,
    );

    if (payment) {
      payment.status = PaymentStatus.SUCCESS;
      payment.providerPaymentId = verification.paymentId;
      payment.receiptUrl = `https://srianvaya.com/receipts/${payment.paymentId}.pdf`;
    }

    return {
      success: true,
      payment,
    };
  }

  async getMyPayments(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) return [];
    return this.dataStore.payments.filter((p) => p.customerId === customer._id);
  }

  async getAllPayments() {
    return this.dataStore.payments.map((p) => {
      const customer = this.dataStore.customers.find((c) => c._id === p.customerId);
      return {
        ...p,
        customer,
      };
    });
  }

  async handleWebhook(providerName: string, rawBody: any, signature: string) {
    this.logger.log(`Received webhook from ${providerName}`);
    const provider = this.getProvider(providerName);
    return provider.handleWebhook(rawBody, signature);
  }
}
