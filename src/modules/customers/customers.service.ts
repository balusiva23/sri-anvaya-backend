import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class CustomersService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getProfile(userId: string) {
    let customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) {
      const user = this.dataStore.users.find((u) => u._id === userId);
      customer = {
        _id: `cust_${Date.now()}`,
        userId,
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        onboardingStep: 1,
        isProfileComplete: false,
        createdAt: new Date(),
      };
      this.dataStore.customers.push(customer);
    }

    const family = this.dataStore.families.find((f) => f.customerId === customer._id);
    const pitruRecords = this.dataStore.pitruRecords.filter((p) => p.customerId === customer._id);
    const subscription = this.dataStore.subscriptions.find((s) => s.customerId === customer._id && s.status === 'ACTIVE');
    const plan = subscription ? this.dataStore.plans.find((p) => p._id === subscription.planId) : null;
    const upcomingEvents = this.dataStore.events.filter((e) => e.customerId === customer._id);

    return {
      customer,
      family,
      pitruRecords,
      subscription: subscription ? { ...subscription, plan } : null,
      upcomingEvents,
    };
  }

  async updateProfile(userId: string, updateDto: any) {
    let customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) {
      customer = {
        _id: `cust_${Date.now()}`,
        userId,
        fullName: updateDto.fullName || '',
        phone: updateDto.phone || '',
        onboardingStep: 1,
        isProfileComplete: false,
        createdAt: new Date(),
      };
      this.dataStore.customers.push(customer);
    }

    Object.assign(customer, updateDto);
    return customer;
  }

  async updateOnboarding(userId: string, data: { step: number; payload: any }) {
    let customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) {
      customer = {
        _id: `cust_${Date.now()}`,
        userId,
        fullName: data.payload?.fullName || '',
        phone: data.payload?.phone || '',
        onboardingStep: data.step,
        isProfileComplete: false,
        createdAt: new Date(),
      };
      this.dataStore.customers.push(customer);
    }

    customer.onboardingStep = Math.max(customer.onboardingStep || 1, data.step);

    // Save step-specific data
    if (data.payload) {
      if (data.payload.address) customer.address = data.payload.address;
      if (data.payload.serviceCity) customer.serviceCity = data.payload.serviceCity;
      if (data.payload.preferences) customer.preferences = data.payload.preferences;
      if (data.payload.fullName) customer.fullName = data.payload.fullName;
      if (data.payload.phone) customer.phone = data.payload.phone;

      // 1. Family Lineage (Find or Create, never duplicate)
      if (data.payload.family) {
        let family = this.dataStore.families.find((f) => f.customerId === customer._id);
        if (!family) {
          family = {
            _id: `fam_${Date.now()}`,
            customerId: customer._id,
            gothram: data.payload.family.gothram || 'Koundinya Gothram',
            kuladeivam: data.payload.family.kuladeivam || '',
            nativePlace: data.payload.family.nativePlace || '',
            members: data.payload.family.members || [],
            createdAt: new Date(),
          };
          this.dataStore.families.push(family);
        } else {
          if (data.payload.family.gothram) family.gothram = data.payload.family.gothram;
          if (data.payload.family.kuladeivam) family.kuladeivam = data.payload.family.kuladeivam;
          if (data.payload.family.nativePlace) family.nativePlace = data.payload.family.nativePlace;
          if (data.payload.family.members) family.members = data.payload.family.members;
        }
      }

      // 2. Pitru Record & Annual Event (De-duplicate & Upsert)
      if (data.payload.pitruRecord && data.payload.pitruRecord.pitruName) {
        let pitru = this.dataStore.pitruRecords.find(
          (p) => p.customerId === customer._id && (p._id === data.payload.pitruRecord._id || p.pitruName === data.payload.pitruRecord.pitruName)
        );

        if (!pitru) {
          // If customer already has a single pitru record from earlier step, update it
          const existingForCustomer = this.dataStore.pitruRecords.filter((p) => p.customerId === customer._id);
          if (existingForCustomer.length > 0) {
            pitru = existingForCustomer[0];
          }
        }

        if (pitru) {
          // Update existing pitru record (Prevent duplicate)
          pitru.pitruName = data.payload.pitruRecord.pitruName;
          pitru.relationship = data.payload.pitruRecord.relationship || pitru.relationship;
          pitru.calendarType = data.payload.pitruRecord.calendarType || pitru.calendarType;
          pitru.masa = data.payload.pitruRecord.masa || pitru.masa;
          pitru.paksha = data.payload.pitruRecord.paksha || pitru.paksha;
          pitru.tithi = data.payload.pitruRecord.tithi || pitru.tithi;
          pitru.nakshatra = data.payload.pitruRecord.nakshatra || pitru.nakshatra;
          if (data.payload.pitruRecord.englishDate) {
            pitru.englishDate = new Date(data.payload.pitruRecord.englishDate);
          }
          pitru.annualDateNotes = data.payload.pitruRecord.annualDateNotes || pitru.annualDateNotes;
          pitru.notes = data.payload.pitruRecord.notes || pitru.notes;
        } else {
          // Create 1 new pitru record
          pitru = {
            _id: `pitru_${Date.now()}`,
            customerId: customer._id,
            karthaName: customer.fullName,
            pitruName: data.payload.pitruRecord.pitruName,
            relationship: data.payload.pitruRecord.relationship || 'Father',
            calendarType: data.payload.pitruRecord.calendarType || 'Chandramana',
            masa: data.payload.pitruRecord.masa || '',
            paksha: data.payload.pitruRecord.paksha || '',
            tithi: data.payload.pitruRecord.tithi || '',
            nakshatra: data.payload.pitruRecord.nakshatra || '',
            englishDate: data.payload.pitruRecord.englishDate ? new Date(data.payload.pitruRecord.englishDate) : new Date(),
            annualDateNotes: data.payload.pitruRecord.annualDateNotes || '',
            notes: data.payload.pitruRecord.notes || '',
            documentUrls: [],
            createdAt: new Date(),
          };
          this.dataStore.pitruRecords.push(pitru);
        }

        // Upsert Event for this Pitru Record (Prevent duplicate events)
        let event = this.dataStore.events.find(
          (e) => e.customerId === customer._id && (e.pitruRecordId === pitru._id || e.title.includes(pitru.pitruName))
        );

        if (!event) {
          const existingEvent = this.dataStore.events.find((e) => e.customerId === customer._id);
          if (existingEvent) {
            event = existingEvent;
          }
        }

        if (event) {
          event.pitruRecordId = pitru._id;
          event.title = `Annual Sradham - ${pitru.pitruName}`;
          if (pitru.englishDate) event.scheduledDate = pitru.englishDate;
          event.location = {
            venueType: 'HOME',
            address: `${customer.address?.line1 || ''} ${customer.address?.line2 || ''}`,
            city: customer.serviceCity || customer.address?.city || 'Chennai',
          };
        } else {
          event = {
            _id: `evt_${Date.now()}`,
            customerId: customer._id,
            pitruRecordId: pitru._id,
            title: `Annual Sradham - ${pitru.pitruName}`,
            scheduledDate: pitru.englishDate || new Date(Date.now() + 30 * 86400000),
            status: 'PLANNING',
            location: {
              venueType: 'HOME',
              address: `${customer.address?.line1 || ''} ${customer.address?.line2 || ''}`,
              city: customer.serviceCity || customer.address?.city || 'Chennai',
            },
            assignedTeam: {},
            checklist: [
              { item: 'Customer Tithi Confirmation', isCompleted: true, completedAt: new Date() },
              { item: 'Venue Address & Timings Verified', isCompleted: false },
              { item: 'Subscription & Payment Verified', isCompleted: false },
              { item: 'Vedic Vadhyar & Swamigals Assigned', isCompleted: false },
              { item: 'Samagri Kit Dispatched', isCompleted: false },
              { item: 'Provider On-Site Arrival Checked', isCompleted: false },
              { item: 'Pinda Pradanam & Homam Completed', isCompleted: false },
              { item: 'Brahmana Bhojanam Completed', isCompleted: false },
              { item: 'Customer Completion Sign-off', isCompleted: false },
            ],
            samagriKitProvided: true,
            notes: 'Configured via Onboarding wizard.',
            createdAt: new Date(),
          };
          this.dataStore.events.push(event);
        }
      }

      // Cleanup any duplicate pitru records or events for this customer
      const seenPitrus = new Set<string>();
      this.dataStore.pitruRecords = this.dataStore.pitruRecords.filter((p) => {
        if (p.customerId !== customer._id) return true;
        const key = `${p.customerId}_${p.pitruName}`;
        if (seenPitrus.has(key)) return false;
        seenPitrus.add(key);
        return true;
      });

      const seenEvents = new Set<string>();
      this.dataStore.events = this.dataStore.events.filter((e) => {
        if (e.customerId !== customer._id) return true;
        const key = `${e.customerId}_${e.title}`;
        if (seenEvents.has(key)) return false;
        seenEvents.add(key);
        return true;
      });

      if (data.step >= 7) {
        customer.isProfileComplete = true;
      }
    }

    return customer;
  }

  async getAllCustomers() {
    return this.dataStore.customers.map((cust) => {
      const user = this.dataStore.users.find((u) => u._id === cust.userId);
      const subscription = this.dataStore.subscriptions.find((s) => s.customerId === cust._id && s.status === 'ACTIVE');
      const plan = subscription ? this.dataStore.plans.find((p) => p._id === subscription.planId) : null;
      const eventsCount = this.dataStore.events.filter((e) => e.customerId === cust._id).length;
      return {
        ...cust,
        email: user?.email,
        subscription: subscription ? { ...subscription, plan } : null,
        eventsCount,
      };
    });
  }

  async getCustomerById(id: string) {
    const customer = this.dataStore.customers.find((c) => c._id === id);
    if (!customer) throw new NotFoundException('Customer not found');
    const user = this.dataStore.users.find((u) => u._id === customer.userId);
    const family = this.dataStore.families.find((f) => f.customerId === customer._id);
    const pitruRecords = this.dataStore.pitruRecords.filter((p) => p.customerId === customer._id);
    const subscriptions = this.dataStore.subscriptions.filter((s) => s.customerId === customer._id);
    const payments = this.dataStore.payments.filter((p) => p.customerId === customer._id);
    const events = this.dataStore.events.filter((e) => e.customerId === customer._id);

    return {
      customer: { ...customer, email: user?.email },
      family,
      pitruRecords,
      subscriptions,
      payments,
      events,
    };
  }
}
