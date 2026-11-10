import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { SubscriptionStatus } from '../../schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMySubscription(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer profile not found');

    const subscription = this.dataStore.subscriptions.find(
      (s) => s.customerId === customer._id && s.status === SubscriptionStatus.ACTIVE,
    );
    if (!subscription) return null;

    const plan = this.dataStore.plans.find((p) => p._id === subscription.planId);
    const payments = this.dataStore.payments.filter((p) => p.subscriptionId === subscription._id);

    return {
      ...subscription,
      plan,
      payments,
    };
  }

  async subscribe(userId: string, planCodeOrId: string, paymentMethod = 'razorpay') {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer profile not found');

    const plan = this.dataStore.plans.find((p) => p._id === planCodeOrId || p.code === planCodeOrId);
    if (!plan) throw new NotFoundException('Selected plan not found');

    // Deactivate previous active subscription if any
    this.dataStore.subscriptions
      .filter((s) => s.customerId === customer._id && s.status === SubscriptionStatus.ACTIVE)
      .forEach((s) => {
        s.status = SubscriptionStatus.COMPLETED;
      });

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const newSub = {
      _id: `sub_${Date.now()}`,
      customerId: customer._id,
      planId: plan._id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      nextBillingDate,
      autoRenew: true,
      metadata: { gateway: paymentMethod },
      createdAt: new Date(),
    };
    this.dataStore.subscriptions.push(newSub);

    // Create initial subscription payment record
    const payment = {
      _id: `pay_${Date.now()}`,
      paymentId: `PAY-SA-${Date.now().toString().slice(-6)}`,
      customerId: customer._id,
      subscriptionId: newSub._id,
      provider: paymentMethod,
      providerPaymentId: `pay_mock_${Date.now()}`,
      amount: plan.monthlyPrice,
      currency: 'INR',
      status: 'SUCCESS',
      paymentMethod: 'UPI / Card',
      receiptUrl: `https://srianvaya.com/receipts/REC-${Date.now().toString().slice(-4)}.pdf`,
      createdAt: new Date(),
    };
    this.dataStore.payments.push(payment);

    return {
      subscription: { ...newSub, plan },
      payment,
    };
  }

  async cancelSubscription(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer not found');

    const subscription = this.dataStore.subscriptions.find(
      (s) => s.customerId === customer._id && s.status === SubscriptionStatus.ACTIVE,
    );
    if (!subscription) throw new BadRequestException('No active subscription to cancel');

    subscription.status = SubscriptionStatus.CANCELLED;
    return { success: true, message: 'Subscription cancelled' };
  }

  async getAllSubscriptions() {
    return this.dataStore.subscriptions.map((sub) => {
      const customer = this.dataStore.customers.find((c) => c._id === sub.customerId);
      const plan = this.dataStore.plans.find((p) => p._id === sub.planId);
      return {
        ...sub,
        customer,
        plan,
      };
    });
  }
}
