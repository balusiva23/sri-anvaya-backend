const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://balusiva1299:Siva2312@cluster0.avjoegu.mongodb.net/srianvaya_db?retryWrites=true&w=majority";

async function syncAllData() {
  try {
    console.log("Connecting to MongoDB Atlas Cluster0...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas successfully!");

    const db = mongoose.connection.db;
    const passwordHash = await bcrypt.hash('SriAnvaya@2026', 10);

    // 1. Users (8 users)
    const users = [
      {
        _id: 'usr_admin_1',
        email: 'admin@srianvaya.com',
        passwordHash,
        fullName: 'Sri Anvaya Administrator',
        phone: '+91 98840 12345',
        roles: ['SUPER_ADMIN', 'ADMIN'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_ops_1',
        email: 'operations@srianvaya.com',
        passwordHash,
        fullName: 'Operations Coordinator',
        phone: '+91 98840 54321',
        roles: ['OPERATIONS'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_cust_1',
        email: 'sundaram.sharma@example.com',
        passwordHash,
        fullName: 'Sundaram Sharma',
        phone: '+91 94440 98765',
        roles: ['CUSTOMER'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_cust_2',
        email: 'venkat.ramani@example.com',
        passwordHash,
        fullName: 'Venkatesan Ramani',
        phone: '+91 98400 11223',
        roles: ['CUSTOMER'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_prov_1',
        email: 'krishna.vadhyar@srianvaya.com',
        passwordHash,
        fullName: 'Sri Krishna Vadhyar',
        phone: '+91 98401 22334',
        roles: ['PROVIDER'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_prov_2',
        email: 'ramaswamy.shastrigal@srianvaya.com',
        passwordHash,
        fullName: 'Sri Ramaswamy Shastrigal',
        phone: '+91 98402 33445',
        roles: ['PROVIDER'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_prov_3',
        email: 'subramanian.dikshitar@srianvaya.com',
        passwordHash,
        fullName: 'Sri Subramanian Dikshitar',
        phone: '+91 98403 44556',
        roles: ['PROVIDER'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        _id: 'usr_prov_4',
        email: 'venkataraman.mami@srianvaya.com',
        passwordHash,
        fullName: 'Sri Anantha Rama Iyer (Madi Cook)',
        phone: '+91 98404 55667',
        roles: ['PROVIDER'],
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // 2. Plans (4 plans)
    const plans = [
      {
        _id: 'plan_ess',
        code: 'ESSENTIAL',
        name: 'Essential Sradham 360',
        monthlyPrice: 1000,
        annualPrice: 12000,
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
      },
      {
        _id: 'plan_std',
        code: 'STANDARD',
        name: 'Standard Sradham 360',
        monthlyPrice: 1500,
        annualPrice: 18000,
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
      },
      {
        _id: 'plan_prem',
        code: 'PREMIUM',
        name: 'Premium Heritage Sradham 360',
        monthlyPrice: 2000,
        annualPrice: 24000,
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
      },
      {
        _id: 'plan_elite',
        code: 'ELITE_SAMHITA',
        name: 'Elite Samhita 360 (NRI Special)',
        monthlyPrice: 3500,
        annualPrice: 42000,
        annualValue: 42000,
        description: 'Bespoke global family lineage management with multi-kshetra tarpanam and multi-angle live video broadcast.',
        inclusions: [
          'Everything in Premium Plan',
          'Global Timezone Synchronization (USA, UK, Singapore, UAE)',
          'Virtual HD 4K Multi-Camera Live Stream & Recording',
          'Special Pitru Tarpana Kit Dispatched Worldwide',
          'Dedicated Vedic Astrologer for Year-Round Muhurtham Advice',
        ],
        isRecommended: false,
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // 3. Customers (2 customers)
    const customers = [
      {
        _id: 'cust_1',
        userId: 'usr_cust_1',
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
      },
      {
        _id: 'cust_2',
        userId: 'usr_cust_2',
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
      },
    ];

    // 4. Families
    const families = [
      {
        _id: 'fam_1',
        customerId: 'cust_1',
        gothram: 'Koundinya Gothram',
        kuladeivam: 'Sri Prasanna Venkatesa Perumal, Thiruparkadal',
        nativePlace: 'Thanjavur, Tamil Nadu',
        members: [
          { id: 'm1', fullName: 'Sundaram Sharma', relationship: 'Self / Kartha', phone: '+91 94440 98765' },
          { id: 'm2', fullName: 'Radha Sundaram', relationship: 'Wife', phone: '+91 94440 98766' },
          { id: 'm3', fullName: 'Anand Sundaram', relationship: 'Son (NRI - USA)', notes: 'Participates virtually' },
        ],
        createdAt: new Date(),
      },
    ];

    // 5. Pitru Records
    const pitruRecords = [
      {
        _id: 'pitru_1',
        customerId: 'cust_1',
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
      },
      {
        _id: 'pitru_2',
        customerId: 'cust_1',
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
      },
    ];

    // 6. Events
    const events = [
      {
        _id: 'evt_1',
        customerId: 'cust_1',
        pitruRecordId: 'pitru_1',
        title: 'Annual Sradham - Late Sri V. Subramania Sharma',
        scheduledDate: new Date('2026-09-24T08:30:00Z'),
        status: 'DISPATCHED',
        location: {
          venueType: 'HOME',
          address: 'Flat 4B, Heritage Towers, 12th Cross Road, Mylapore',
          city: 'Chennai',
          coordinates: { lat: 13.0334, lng: 80.2677 },
        },
        assignedTeam: {
          purohithId: 'prov_1',
          purohithName: 'Sri Krishna Vadhyar',
          swamigal1Id: 'prov_2',
          swamigal1Name: 'Sri Ramaswamy Shastrigal',
          swamigal2Id: 'prov_3',
          swamigal2Name: 'Sri Subramanian Dikshitar',
          cookId: 'prov_4',
          cookName: 'Sri Anantha Rama Iyer (Madi Cook)',
        },
        checklist: [
          { item: 'Customer Tithi Confirmation', isCompleted: true, completedAt: new Date('2026-08-01') },
          { item: 'Venue Address & Timings Verified', isCompleted: true, completedAt: new Date('2026-08-05') },
          { item: 'Subscription & Payment Verified', isCompleted: true, completedAt: new Date('2026-08-10') },
          { item: 'Vedic Vadhyar & Swamigals Assigned', isCompleted: true, completedAt: new Date('2026-08-15') },
          { item: 'Samagri Kit Dispatched to Logistics Hub', isCompleted: true, completedAt: new Date('2026-08-20') },
          { item: 'Provider On-Site Arrival Checked', isCompleted: false },
          { item: 'Pinda Pradanam & Homam Completed', isCompleted: false },
          { item: 'Brahmana Bhojanam Completed', isCompleted: false },
          { item: 'Customer Completion Sign-off', isCompleted: false },
        ],
        samagriKitProvided: true,
        notes: '4-member team dispatched. Madi cooking ingredients verified.',
        createdAt: new Date(),
      },
    ];

    // 7. Providers (4 Vedic priests & specialists)
    const providers = [
      {
        _id: 'prov_1',
        userId: 'usr_prov_1',
        fullName: 'Sri Krishna Vadhyar',
        phone: '+91 98401 22334',
        role: 'PUROHITH',
        city: 'Chennai',
        serviceLocations: ['Mylapore', 'Mandaveli', 'Adyar', 'T. Nagar', 'West Mambalam'],
        verificationStatus: 'VERIFIED',
        rating: 4.98,
        isAvailable: true,
        completedEventsCount: 142,
        bankDetails: { accountNumber: 'XXXXXX9821', ifscCode: 'HDFC0000124', accountHolderName: 'Krishna Vadhyar', upiId: 'krishna.vadhyar@okaxis' },
        createdAt: new Date(),
      },
      {
        _id: 'prov_2',
        userId: 'usr_prov_2',
        fullName: 'Sri Ramaswamy Shastrigal',
        phone: '+91 98402 33445',
        role: 'SWAMIGAL',
        city: 'Chennai',
        serviceLocations: ['Mylapore', 'Triplicane', 'Royapettah', 'Nungambakkam'],
        verificationStatus: 'VERIFIED',
        rating: 4.95,
        isAvailable: true,
        completedEventsCount: 98,
        bankDetails: { accountNumber: 'XXXXXX4412', ifscCode: 'SBIN0000800', accountHolderName: 'Ramaswamy Shastrigal', upiId: 'ramaswamy@okhdfcbank' },
        createdAt: new Date(),
      },
      {
        _id: 'prov_3',
        userId: 'usr_prov_3',
        fullName: 'Sri Subramanian Dikshitar',
        phone: '+91 98403 44556',
        role: 'SWAMIGAL',
        city: 'Chennai',
        serviceLocations: ['Mylapore', 'Besant Nagar', 'Thiruvanmiyur', 'Adyar'],
        verificationStatus: 'VERIFIED',
        rating: 4.92,
        isAvailable: true,
        completedEventsCount: 84,
        bankDetails: { accountNumber: 'XXXXXX5523', ifscCode: 'ICIC0000012', accountHolderName: 'Subramanian Dikshitar', upiId: 'dikshitar@icici' },
        createdAt: new Date(),
      },
      {
        _id: 'prov_4',
        userId: 'usr_prov_4',
        fullName: 'Sri Anantha Rama Iyer (Madi Cook)',
        phone: '+91 98404 55667',
        role: 'COOK',
        city: 'Chennai',
        serviceLocations: ['Mylapore', 'Adyar', 'T. Nagar', 'Alwarpet', 'R.A. Puram'],
        verificationStatus: 'VERIFIED',
        rating: 4.99,
        isAvailable: true,
        completedEventsCount: 165,
        bankDetails: { accountNumber: 'XXXXXX1190', ifscCode: 'IOBA0001400', accountHolderName: 'Anantha Rama Iyer', upiId: 'ananthiyer@upi' },
        createdAt: new Date(),
      },
    ];

    // 8. Welfare Wallets
    const wallets = [
      {
        _id: 'wal_1',
        providerId: 'prov_1',
        currentBalance: 14400,
        lifetimeAllocated: 34800,
        lifetimeDisbursed: 20400,
        lastConsolidatedAt: new Date('2026-07-31'),
        status: 'ACTIVE',
        createdAt: new Date(),
      },
      {
        _id: 'wal_2',
        providerId: 'prov_2',
        currentBalance: 8200,
        lifetimeAllocated: 19800,
        lifetimeDisbursed: 11600,
        lastConsolidatedAt: new Date('2026-07-31'),
        status: 'ACTIVE',
        createdAt: new Date(),
      },
      {
        _id: 'wal_3',
        providerId: 'prov_3',
        currentBalance: 6800,
        lifetimeAllocated: 16200,
        lifetimeDisbursed: 9400,
        lastConsolidatedAt: new Date('2026-07-31'),
        status: 'ACTIVE',
        createdAt: new Date(),
      },
      {
        _id: 'wal_4',
        providerId: 'prov_4',
        currentBalance: 12600,
        lifetimeAllocated: 28400,
        lifetimeDisbursed: 15800,
        lastConsolidatedAt: new Date('2026-07-31'),
        status: 'ACTIVE',
        createdAt: new Date(),
      },
    ];

    // 9. Subscriptions
    const subscriptions = [
      {
        _id: 'sub_1',
        customerId: 'cust_1',
        planId: 'plan_std',
        status: 'ACTIVE',
        startDate: new Date('2026-01-01'),
        nextBillingDate: new Date('2026-09-01'),
        autoRenew: true,
        metadata: { billingCycle: 'MONTHLY', gateway: 'razorpay' },
        createdAt: new Date(),
      },
    ];

    // 10. Payments
    const payments = [
      {
        _id: 'pay_1',
        paymentId: 'PAY-SA-2026-8801',
        customerId: 'cust_1',
        subscriptionId: 'sub_1',
        provider: 'razorpay',
        providerPaymentId: 'pay_rzp_mock_8819021',
        providerOrderId: 'order_rzp_mock_00192',
        amount: 1500,
        currency: 'INR',
        status: 'SUCCESS',
        paymentMethod: 'UPI / NetBanking',
        receiptUrl: '/customer/payments',
        createdAt: new Date('2026-08-01'),
      },
      {
        _id: 'pay_2',
        paymentId: 'PAY-SA-2026-7901',
        customerId: 'cust_1',
        subscriptionId: 'sub_1',
        provider: 'razorpay',
        providerPaymentId: 'pay_rzp_mock_7719201',
        providerOrderId: 'order_rzp_mock_00171',
        amount: 1500,
        currency: 'INR',
        status: 'SUCCESS',
        paymentMethod: 'Credit Card',
        receiptUrl: '/customer/payments',
        createdAt: new Date('2026-07-01'),
      },
    ];

    // 11. System Settings
    const systemSettings = [
      { _id: 'set_1', key: 'storage_provider', value: 'cloudinary', updatedAt: new Date() },
      { _id: 'set_2', key: 'default_welfare_percentage', value: '12', updatedAt: new Date() },
      { _id: 'set_3', key: 'primary_contact_phone', value: '+91 98840 12345', updatedAt: new Date() },
      { _id: 'set_4', key: 'support_email', value: 'contact@srianvaya.com', updatedAt: new Date() },
    ];

    console.log("Writing full datasets to MongoDB Atlas collections...");

    const resetCollection = async (name, docs) => {
      await db.collection(name).deleteMany({});
      if (docs && docs.length > 0) {
        await db.collection(name).insertMany(docs);
      }
    };

    await resetCollection('users', users);
    await resetCollection('plans', plans);
    await resetCollection('customers', customers);
    await resetCollection('families', families);
    await resetCollection('pitru_records', pitruRecords);
    await resetCollection('events', events);
    await resetCollection('providers', providers);
    await resetCollection('wallets', wallets);
    await resetCollection('subscriptions', subscriptions);
    await resetCollection('payments', payments);
    await resetCollection('system_settings', systemSettings);

    console.log("\n=======================================================");
    console.log(">> ALL COLLECTIONS AND DOCUMENTS SYNCED TO ATLAS! <<");
    console.log("=======================================================\n");

    const colls = await db.listCollections().toArray();
    for (const c of colls) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`Collection: ${c.name.padEnd(20)} -> ${count} Documents`);
    }

    await mongoose.disconnect();
    console.log("\nDone!");
  } catch (err) {
    console.error("Sync error:", err);
  }
}

syncAllData();
