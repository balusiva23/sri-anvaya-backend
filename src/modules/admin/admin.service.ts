import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { EventStatus } from '../../schemas/event.schema';
import { SubscriptionStatus } from '../../schemas/subscription.schema';
import { PaymentStatus } from '../../schemas/payment.schema';

@Injectable()
export class AdminService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getDashboardMetrics() {
    const totalCustomers = this.dataStore.customers.length;
    const activeSubscriptions = this.dataStore.subscriptions.filter(
      (s) => s.status === SubscriptionStatus.ACTIVE,
    ).length;

    const successfulPayments = this.dataStore.payments.filter((p) => p.status === PaymentStatus.SUCCESS);
    const monthlyCollections = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

    const upcomingEvents = this.dataStore.events.filter(
      (e) => e.status !== EventStatus.COMPLETED && e.status !== EventStatus.CANCELLED,
    ).length;

    const totalProviders = this.dataStore.providers.length;
    const availableProviders = this.dataStore.providers.filter((p) => p.isAvailable).length;

    const pendingWelfare = this.dataStore.wallets.reduce((sum, w) => sum + (w.currentBalance || 0), 0);

    // Plan distribution
    const planDistribution = this.dataStore.plans.map((plan) => {
      const count = this.dataStore.subscriptions.filter(
        (s) => s.planId === plan._id && s.status === SubscriptionStatus.ACTIVE,
      ).length;
      return {
        code: plan.code,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        count,
      };
    });

    // Event funnel
    const eventFunnel = {
      planning: this.dataStore.events.filter((e) => e.status === EventStatus.PLANNING).length,
      providerAssignment: this.dataStore.events.filter((e) => e.status === EventStatus.PROVIDER_ASSIGNMENT).length,
      ready: this.dataStore.events.filter((e) => e.status === EventStatus.READY).length,
      eventDay: this.dataStore.events.filter((e) => e.status === EventStatus.EVENT_DAY).length,
      completed: this.dataStore.events.filter((e) => e.status === EventStatus.COMPLETED).length,
    };

    return {
      kpis: {
        totalCustomers,
        activeSubscriptions,
        monthlyCollections,
        upcomingEvents,
        totalProviders,
        availableProviders,
        pendingWelfare,
      },
      planDistribution,
      eventFunnel,
      recentEvents: this.dataStore.events.slice(-5).map((e) => {
        const customer = this.dataStore.customers.find((c) => c._id === e.customerId);
        return { ...e, customerName: customer?.fullName };
      }),
      recentPayments: this.dataStore.payments.slice(-5).map((p) => {
        const customer = this.dataStore.customers.find((c) => c._id === p.customerId);
        return { ...p, customerName: customer?.fullName };
      }),
    };
  }

  async getReports() {
    return {
      financial: {
        annualProjectedRevenue: 18000 * this.dataStore.subscriptions.length,
        collectedYTD: this.dataStore.payments.filter((p) => p.status === 'SUCCESS').reduce((acc, p) => acc + p.amount, 0),
        pendingInvoices: 0,
        welfareReserveTotal: this.dataStore.wallets.reduce((acc, w) => acc + (w.lifetimeAllocated || 0), 0),
      },
      operations: {
        totalScheduledEvents: this.dataStore.events.length,
        completionRate: '98.5%',
        averageTeamSize: 4,
        onTimeArrivalRate: '99.1%',
      },
      providerWelfare: {
        totalProvidersEnrolled: this.dataStore.providers.length,
        welfareRate: '12%',
        totalAccumulatedProtection: this.dataStore.wallets.reduce((acc, w) => acc + (w.lifetimeAllocated || 0), 0),
      },
    };
  }
}
