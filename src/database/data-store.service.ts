import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '../schemas/user.schema';
import { ProviderRole, ProviderVerificationStatus } from '../schemas/provider.schema';
import { EventStatus } from '../schemas/event.schema';
import { AssignmentStatus } from '../schemas/assignment.schema';
import { SubscriptionStatus } from '../schemas/subscription.schema';
import { PaymentStatus } from '../schemas/payment.schema';

import * as mongoose from 'mongoose';

@Injectable()
export class DataStoreService implements OnModuleInit {
  private readonly logger = new Logger(DataStoreService.name);
  public isMongoConnected = false;

  public users: any[] = [];
  public customers: any[] = [];
  public families: any[] = [];
  public pitruRecords: any[] = [];
  public plans: any[] = [];
  public subscriptions: any[] = [];
  public payments: any[] = [];
  public events: any[] = [];
  public providers: any[] = [];
  public assignments: any[] = [];
  public earnings: any[] = [];
  public wallets: any[] = [];
  public walletTransactions: any[] = [];
  public notifications: any[] = [];
  public systemSettings: any[] = [];
  public auditLogs: any[] = [];

  async onModuleInit() {
    this.logger.log('Initializing Sri Anvaya Data Store & Seed Registry...');
    await this.seedInitialData();
    await this.connectMongoCloud();
  }

  private async connectMongoCloud() {
    const uri = process.env.MONGODB_URI;
    if (uri && !uri.includes('localhost')) {
      try {
        this.logger.log(`Connecting to MongoDB Atlas Cloud Cluster...`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        this.isMongoConnected = true;
        this.logger.log(`>> Successfully connected to MongoDB Atlas Cluster0! <<`);

        // Sync initial data to MongoDB collections
        const db = mongoose.connection.db;
        if (db) {
          await Promise.all([
            ...this.users.map((u) => db.collection('users').updateOne({ email: u.email }, { $set: u }, { upsert: true })),
            ...this.plans.map((p) => db.collection('plans').updateOne({ code: p.code }, { $set: p }, { upsert: true })),
            ...this.customers.map((c) => db.collection('customers').updateOne({ _id: c._id }, { $set: c }, { upsert: true })),
            ...this.providers.map((pr) => db.collection('providers').updateOne({ _id: pr._id }, { $set: pr }, { upsert: true })),
            ...this.events.map((e) => db.collection('events').updateOne({ _id: e._id }, { $set: e }, { upsert: true })),
            ...this.pitruRecords.map((pt) => db.collection('pitru_records').updateOne({ _id: pt._id }, { $set: pt }, { upsert: true })),
          ]);
          this.logger.log(`>> Synced collections to 'srianvaya_db' on MongoDB Atlas! <<`);
        }
      } catch (err: any) {
        this.logger.warn(`MongoDB Atlas connection note: ${err.message}. Operating in memory-backed hybrid persistence.`);
      }
    }
  }

  private async seedInitialData() {
    const passwordHash = await bcrypt.hash('SriAnvaya@2026', 10);

    // 1. Users
    const adminUser = {
      _id: 'usr_admin_1',
      email: 'admin@srianvaya.com',
      passwordHash,
      fullName: 'Sri Anvaya Administrator',
      phone: '+91 98840 12345',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      isActive: true,
      createdAt: new Date(),
    };

    const opsUser = {
      _id: 'usr_ops_1',
      email: 'operations@srianvaya.com',
      passwordHash,
      fullName: 'Operations Coordinator',
      phone: '+91 98840 54321',
      roles: [UserRole.OPERATIONS],
      isActive: true,
      createdAt: new Date(),
    };

    const customerUser1 = {
      _id: 'usr_cust_1',
      email: 'sundaram.sharma@example.com',
      passwordHash,
      fullName: 'Sundaram Sharma',
      phone: '+91 94440 98765',
      roles: [UserRole.CUSTOMER],
      isActive: true,
      createdAt: new Date(),
    };

    const customerUser2 = {
      _id: 'usr_cust_2',
      email: 'venkat.ramani@example.com',
      passwordHash,
      fullName: 'Venkatesan Ramani',
      phone: '+91 98400 11223',
      roles: [UserRole.CUSTOMER],
      isActive: true,
      createdAt: new Date(),
    };

    const purohithUser = {
      _id: 'usr_prov_1',
      email: 'krishna.vadhyar@srianvaya.com',
      passwordHash,
      fullName: 'Sri Krishna Vadhyar',
      phone: '+91 98401 22334',
      roles: [UserRole.PROVIDER],
      isActive: true,
      createdAt: new Date(),
    };

    const swamigal1User = {
      _id: 'usr_prov_2',
      email: 'ramaswamy.shastrigal@srianvaya.com',
      passwordHash,
      fullName: 'Sri Ramaswamy Shastrigal',
      phone: '+91 98402 33445',
      roles: [UserRole.PROVIDER],
      isActive: true,
      createdAt: new Date(),
    };

    const swamigal2User = {
      _id: 'usr_prov_3',
      email: 'subramanian.dikshitar@srianvaya.com',
      passwordHash,
      fullName: 'Sri Subramanian Dikshitar',
      phone: '+91 98403 44556',
      roles: [UserRole.PROVIDER],
      isActive: true,
      createdAt: new Date(),
    };

    const cookUser = {
      _id: 'usr_prov_4',
      email: 'venkataraman.mami@srianvaya.com',
      passwordHash,
      fullName: 'Sri Anantha Rama Iyer (Madi Cook)',
      phone: '+91 98404 55667',
      roles: [UserRole.PROVIDER],
      isActive: true,
      createdAt: new Date(),
    };

    this.users.push(adminUser, opsUser, customerUser1, customerUser2, purohithUser, swamigal1User, swamigal2User, cookUser);

    // 2. Customers
    const cust1 = {
      _id: 'cust_1',
      userId: customerUser1._id,
      fullName: 'Sundaram Sharma',
      phone: '+91 94440 98765',
      altPhone: '+91 44 2499 1234',
      address: {
        line1: 'Flat 4B, Heritage Towers, 12th Cross Road',
        line2: 'Mylapore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600004',
        country: 'India',
      },
      serviceCity: 'Chennai',
      onboardingStep: 8,
      isProfileComplete: true,
      preferences: ['Smartha Sampradayam', 'Vadakalai Iyengar (if applicable)', 'Strict Madi Cooking'],
      createdAt: new Date(),
    };

    const cust2 = {
      _id: 'cust_2',
      userId: customerUser2._id,
      fullName: 'Venkatesan Ramani',
      phone: '+91 98400 11223',
      address: {
        line1: 'Villa 18, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560066',
        country: 'India',
      },
      serviceCity: 'Bengaluru',
      onboardingStep: 6,
      isProfileComplete: false,
      preferences: ['Telugu Brahmin Sampradayam'],
      createdAt: new Date(),
    };

    this.customers.push(cust1, cust2);

    // 3. Families
    const family1 = {
      _id: 'fam_1',
      customerId: cust1._id,
      gothram: 'Koundinya Gothram',
      kuladeivam: 'Sri Prasanna Venkatesa Perumal, Thiruparkadal',
      nativePlace: 'Thanjavur, Tamil Nadu',
      members: [
        { id: 'm1', fullName: 'Sundaram Sharma', relationship: 'Self / Kartha', phone: '+91 94440 98765' },
        { id: 'm2', fullName: 'Radha Sundaram', relationship: 'Wife', phone: '+91 94440 98766' },
        { id: 'm3', fullName: 'Anand Sundaram', relationship: 'Son (NRI - USA)', notes: 'Participates virtually' },
      ],
      createdAt: new Date(),
    };

    this.families.push(family1);

    // 4. Pitru Records
    const pitru1 = {
      _id: 'pitru_1',
      customerId: cust1._id,
      karthaName: 'Sundaram Sharma',
      pitruName: 'Late Sri V. Subramania Sharma',
      relationship: 'Father',
      calendarType: 'Chandramana',
      masa: 'Bhadrapada',
      paksha: 'Krishna Paksha (Mahalaya)',
      tithi: 'Navami',
      nakshatra: 'Rohini',
      englishDate: new Date('2026-09-24'),
      annualDateNotes: 'Observed annually during Mahalaya Paksha Navami tithi.',
      notes: 'Requires 2 Vedic Swamigals and dedicated traditional Madi Cook.',
      documentUrls: [],
      createdAt: new Date(),
    };

    const pitru2 = {
      _id: 'pitru_2',
      customerId: cust1._id,
      karthaName: 'Sundaram Sharma',
      pitruName: 'Late Smt. Meenakshi Ammal',
      relationship: 'Mother',
      calendarType: 'Solar (Tamil)',
      masa: 'Karthigai',
      paksha: 'Shukla Paksha',
      tithi: 'Dwitiya',
      nakshatra: 'Krittika',
      englishDate: new Date('2026-11-28'),
      annualDateNotes: 'Solar Tamil month Karthigai tithi.',
      notes: 'Matru Sradham rituals.',
      documentUrls: [],
      createdAt: new Date(),
    };

    this.pitruRecords.push(pitru1, pitru2);

    // 5. Plans
    const planEssential = {
      _id: 'plan_ess',
      code: 'ESSENTIAL',
      name: 'Essential Sradham 360',
      monthlyPrice: 1000,
      annualValue: 12000,
      description: 'Foundational recurring plan covering complete annual coordination, Purohith & Dakshina arrangements.',
      inclusions: [
        'Dedicated Family Relationship Manager',
        'Annual Tithi & Calendar Computation',
        '1 Verified Senior Purohith Vadhyar',
        'Standard Samagri List & Coordination',
        'SMS & WhatsApp Prior Reminders',
      ],
      isRecommended: false,
      isActive: true,
      createdAt: new Date(),
    };

    const planStandard = {
      _id: 'plan_std',
      code: 'STANDARD',
      name: 'Standard Sradham 360',
      monthlyPrice: 1500,
      annualValue: 18000,
      description: 'Most popular all-inclusive traditional service package with complete 4-person ritual team.',
      inclusions: [
        'Everything in Essential Plan',
        'Full 4-Member Ritual Team (1 Purohith + 2 Swamigals + 1 Madi Cook)',
        'Standard Traditional Samagri Kit Delivered',
        'All Provider Dakshinas Handled by Sri Anvaya',
        'Provider 12% Welfare Wallet Contribution',
        'Post-Event Ancestral Archana at Srirangam / Kashi',
      ],
      isRecommended: true,
      isActive: true,
      createdAt: new Date(),
    };

    const planPremium = {
      _id: 'plan_prem',
      code: 'PREMIUM',
      name: 'Premium Heritage Sradham 360',
      monthlyPrice: 2000,
      annualValue: 24000,
      description: 'Comprehensive white-glove concierge management including high-grade organic samagri and sacred theertham.',
      inclusions: [
        'Everything in Standard Plan',
        'High-Grade Organic Puja & Cooking Samagri Included',
        'Sacred Ganga & Cauvery Theertham Kit',
        'NRI Family HD Live Video Streaming Link',
        'Priority Rescheduling & Dedicated Concierge',
        'Annual Heritage Archana in 3 Holy Kshetras',
      ],
      isRecommended: false,
      isActive: true,
      createdAt: new Date(),
    };

    this.plans.push(planEssential, planStandard, planPremium);

    // 6. Subscriptions
    const sub1 = {
      _id: 'sub_1',
      customerId: cust1._id,
      planId: planStandard._id,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date('2026-01-01'),
      nextBillingDate: new Date('2026-09-01'),
      autoRenew: true,
      metadata: { billingCycle: 'MONTHLY', gateway: 'razorpay' },
      createdAt: new Date(),
    };

    this.subscriptions.push(sub1);

    // 7. Payments
    const pay1 = {
      _id: 'pay_1',
      paymentId: 'PAY-SA-2026-8801',
      customerId: cust1._id,
      subscriptionId: sub1._id,
      provider: 'razorpay',
      providerPaymentId: 'pay_rzp_mock_8819021',
      providerOrderId: 'order_rzp_mock_00192',
      amount: 1500,
      currency: 'INR',
      status: PaymentStatus.SUCCESS,
      paymentMethod: 'UPI / NetBanking',
      receiptUrl: '/customer/payments',
      createdAt: new Date('2026-08-01'),
    };

    const pay2 = {
      _id: 'pay_2',
      paymentId: 'PAY-SA-2026-7901',
      customerId: cust1._id,
      subscriptionId: sub1._id,
      provider: 'razorpay',
      providerPaymentId: 'pay_rzp_mock_7719201',
      providerOrderId: 'order_rzp_mock_00171',
      amount: 1500,
      currency: 'INR',
      status: PaymentStatus.SUCCESS,
      paymentMethod: 'Credit Card',
      receiptUrl: '/customer/payments',
      createdAt: new Date('2026-07-01'),
    };

    this.payments.push(pay1, pay2);

    // 8. Providers
    const prov1 = {
      _id: 'prov_1',
      userId: purohithUser._id,
      fullName: 'Sri Krishna Vadhyar',
      phone: '+91 98401 22334',
      role: ProviderRole.PUROHITH,
      city: 'Chennai',
      serviceLocations: ['Mylapore', 'Mandaveli', 'Adyar', 'T. Nagar', 'West Mambalam'],
      verificationStatus: ProviderVerificationStatus.VERIFIED,
      rating: 4.98,
      isAvailable: true,
      completedEventsCount: 142,
      bankDetails: { accountNumber: 'XXXXXX9821', ifscCode: 'HDFC0000124', accountHolderName: 'Krishna Vadhyar', upiId: 'krishna.vadhyar@okaxis' },
      createdAt: new Date(),
    };

    const prov2 = {
      _id: 'prov_2',
      userId: swamigal1User._id,
      fullName: 'Sri Ramaswamy Shastrigal',
      phone: '+91 98402 33445',
      role: ProviderRole.SWAMIGAL,
      city: 'Chennai',
      serviceLocations: ['Mylapore', 'Triplicane', 'Royapettah', 'Nungambakkam'],
      verificationStatus: ProviderVerificationStatus.VERIFIED,
      rating: 4.95,
      isAvailable: true,
      completedEventsCount: 98,
      bankDetails: { accountNumber: 'XXXXXX4412', ifscCode: 'SBIN0000800', accountHolderName: 'Ramaswamy Shastrigal', upiId: 'ramaswamy@okhdfcbank' },
      createdAt: new Date(),
    };

    const prov3 = {
      _id: 'prov_3',
      userId: swamigal2User._id,
      fullName: 'Sri Subramanian Dikshitar',
      phone: '+91 98403 44556',
      role: ProviderRole.SWAMIGAL,
      city: 'Chennai',
      serviceLocations: ['Mylapore', 'Besant Nagar', 'Thiruvanmiyur', 'Adyar'],
      verificationStatus: ProviderVerificationStatus.VERIFIED,
      rating: 4.92,
      isAvailable: true,
      completedEventsCount: 84,
      bankDetails: { accountNumber: 'XXXXXX5523', ifscCode: 'ICIC0000012', accountHolderName: 'Subramanian Dikshitar', upiId: 'dikshitar@icici' },
      createdAt: new Date(),
    };

    const prov4 = {
      _id: 'prov_4',
      userId: cookUser._id,
      fullName: 'Sri Anantha Rama Iyer (Madi Cook)',
      phone: '+91 98404 55667',
      role: ProviderRole.COOK,
      city: 'Chennai',
      serviceLocations: ['Mylapore', 'Adyar', 'T. Nagar', 'Alwarpet', 'R.A. Puram'],
      verificationStatus: ProviderVerificationStatus.VERIFIED,
      rating: 4.99,
      isAvailable: true,
      completedEventsCount: 165,
      bankDetails: { accountNumber: 'XXXXXX1190', ifscCode: 'IOBA0001400', accountHolderName: 'Anantha Rama Iyer', upiId: 'ananthiyer@upi' },
      createdAt: new Date(),
    };

    this.providers.push(prov1, prov2, prov3, prov4);

    // 9. Welfare Wallets for Providers
    const wal1 = {
      _id: 'wal_1',
      providerId: prov1._id,
      currentBalance: 14400,
      lifetimeAllocated: 34800,
      lifetimeDisbursed: 20400,
      lastConsolidatedAt: new Date('2026-07-31'),
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    const wal2 = {
      _id: 'wal_2',
      providerId: prov2._id,
      currentBalance: 9600,
      lifetimeAllocated: 24000,
      lifetimeDisbursed: 14400,
      lastConsolidatedAt: new Date('2026-07-31'),
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    const wal3 = {
      _id: 'wal_3',
      providerId: prov3._id,
      currentBalance: 8200,
      lifetimeAllocated: 20200,
      lifetimeDisbursed: 12000,
      lastConsolidatedAt: new Date('2026-07-31'),
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    const wal4 = {
      _id: 'wal_4',
      providerId: prov4._id,
      currentBalance: 16800,
      lifetimeAllocated: 41200,
      lifetimeDisbursed: 24400,
      lastConsolidatedAt: new Date('2026-07-31'),
      status: 'ACTIVE',
      createdAt: new Date(),
    };

    this.wallets.push(wal1, wal2, wal3, wal4);

    // 10. Events
    const event1 = {
      _id: 'evt_1',
      customerId: cust1._id,
      pitruRecordId: pitru1._id,
      planId: planStandard._id,
      title: 'Annual Sradham - Late Sri V. Subramania Sharma',
      scheduledDate: new Date('2026-09-24T07:30:00Z'),
      status: EventStatus.PROVIDER_ASSIGNMENT,
      location: {
        venueType: 'HOME',
        address: 'Flat 4B, Heritage Towers, 12th Cross Road, Mylapore',
        city: 'Chennai',
        pincode: '600004',
        notes: 'Ground floor visitor parking available. Lift to 4th floor.',
      },
      assignedTeam: {
        purohithId: prov1._id,
        swamigal1Id: prov2._id,
        swamigal2Id: prov3._id,
        cookId: prov4._id,
      },
      checklist: [
        { item: 'Customer Tithi Confirmation', isCompleted: true, completedAt: new Date() },
        { item: 'Venue Address & Timings Verified', isCompleted: true, completedAt: new Date() },
        { item: 'Subscription & Payment Verified', isCompleted: true, completedAt: new Date() },
        { item: 'Vedic Vadhyar & Swamigals Assigned', isCompleted: true, completedAt: new Date() },
        { item: 'Samagri Kit Dispatched', isCompleted: false },
        { item: 'Provider On-Site Arrival Checked', isCompleted: false },
        { item: 'Pinda Pradanam & Homam Completed', isCompleted: false },
        { item: 'Brahmana Bhojanam Completed', isCompleted: false },
        { item: 'Customer Completion Sign-off', isCompleted: false },
      ],
      samagriKitProvided: true,
      notes: 'Traditional Smartha ceremony. All samagri kit included.',
      adminVerified: true,
      createdAt: new Date(),
    };

    this.events.push(event1);

    // 11. Provider Assignments for Event 1
    const asg1 = {
      _id: 'asg_1',
      eventId: event1._id,
      providerId: prov1._id,
      roleInEvent: 'PUROHITH',
      status: AssignmentStatus.ACCEPTED,
      assignedAt: new Date('2026-08-20'),
      respondedAt: new Date('2026-08-21'),
      grossRemuneration: 3500,
      createdAt: new Date(),
    };

    const asg2 = {
      _id: 'asg_2',
      eventId: event1._id,
      providerId: prov2._id,
      roleInEvent: 'SWAMIGAL_1',
      status: AssignmentStatus.ACCEPTED,
      assignedAt: new Date('2026-08-20'),
      respondedAt: new Date('2026-08-21'),
      grossRemuneration: 2500,
      createdAt: new Date(),
    };

    const asg3 = {
      _id: 'asg_3',
      eventId: event1._id,
      providerId: prov3._id,
      roleInEvent: 'SWAMIGAL_2',
      status: AssignmentStatus.ACCEPTED,
      assignedAt: new Date('2026-08-20'),
      respondedAt: new Date('2026-08-22'),
      grossRemuneration: 2500,
      createdAt: new Date(),
    };

    const asg4 = {
      _id: 'asg_4',
      eventId: event1._id,
      providerId: prov4._id,
      roleInEvent: 'COOK',
      status: AssignmentStatus.ACCEPTED,
      assignedAt: new Date('2026-08-20'),
      respondedAt: new Date('2026-08-21'),
      grossRemuneration: 3000,
      createdAt: new Date(),
    };

    this.assignments.push(asg1, asg2, asg3, asg4);

    // 12. System Settings
    this.systemSettings.push(
      { key: 'DEFAULT_WELFARE_PERCENTAGE', value: 12, description: 'Default percentage allocated to provider welfare wallet', category: 'WELFARE' },
      { key: 'REMINDER_T_MINUS_30_DAYS', value: true, description: 'Trigger automatic 30-day upcoming Sradham reminder via WhatsApp & Email', category: 'NOTIFICATIONS' },
      { key: 'REMINDER_T_MINUS_7_DAYS', value: true, description: 'Trigger 7-day operational confirmation notification', category: 'NOTIFICATIONS' },
      { key: 'ACTIVE_PAYMENT_GATEWAY', value: 'razorpay', description: 'Primary payment provider (razorpay / stripe)', category: 'PAYMENTS' },
      { key: 'AUTO_ASSIGNMENT_RADIUS_KM', value: 25, description: 'Maximum radius for automated provider matching', category: 'OPERATIONS' },
    );

    // 13. Notifications
    this.notifications.push(
      {
        _id: 'notif_1',
        userId: customerUser1._id,
        channel: 'WHATSAPP',
        title: 'Upcoming Sradham 360 Notification',
        message: 'Namaskaram Sundaram Sharma ji, your annual Sradham date for Late Sri V. Subramania Sharma is scheduled on 24 Sep 2026. Sri Krishna Vadhyar and team have been confirmed.',
        status: 'DELIVERED',
        isRead: false,
        createdAt: new Date(),
      },
      {
        _id: 'notif_2',
        userId: purohithUser._id,
        channel: 'IN_APP',
        title: 'New Sradham Service Assigned',
        message: 'You are assigned as Chief Vadhyar for Sradham on 24 Sep 2026 at Mylapore, Chennai.',
        status: 'DELIVERED',
        isRead: true,
        createdAt: new Date(),
      },
    );

    // 14. Audit Logs
    this.auditLogs.push(
      {
        _id: 'aud_1',
        userId: adminUser._id,
        userEmail: adminUser.email,
        role: 'SUPER_ADMIN',
        action: 'ASSIGN_TEAM',
        entity: 'EVENT',
        entityId: event1._id,
        newValue: { purohith: prov1.fullName, swamigals: [prov2.fullName, prov3.fullName], cook: prov4.fullName },
        createdAt: new Date(),
      }
    );

    this.logger.log(`Data store seeded with ${this.users.length} Users, ${this.customers.length} Customers, ${this.events.length} Events, ${this.providers.length} Providers.`);
  }
}
