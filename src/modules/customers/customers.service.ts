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
    const upcomingEvents = this.dataStore.events
      .filter((e) => e.customerId === customer._id)
      .map((e) => {
        const assignedTeamDetails: any = {};
        if (e.assignedTeam?.purohithId) {
          assignedTeamDetails.purohith = this.dataStore.providers.find((p) => p._id === e.assignedTeam.purohithId);
        }
        if (e.assignedTeam?.swamigal1Id) {
          assignedTeamDetails.swamigal1 = this.dataStore.providers.find((p) => p._id === e.assignedTeam.swamigal1Id);
        }
        if (e.assignedTeam?.swamigal2Id) {
          assignedTeamDetails.swamigal2 = this.dataStore.providers.find((p) => p._id === e.assignedTeam.swamigal2Id);
        }
        if (e.assignedTeam?.cookId) {
          assignedTeamDetails.cook = this.dataStore.providers.find((p) => p._id === e.assignedTeam.cookId);
        }
        return {
          ...e,
          assignedTeamDetails,
        };
      });

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

    const user = this.dataStore.users.find((u) => u._id === userId);
    if (user) {
      if (updateDto.fullName) user.fullName = updateDto.fullName.trim();
      if (updateDto.phone) user.phone = updateDto.phone.trim();
    }

    return {
      customer,
      user: user
        ? {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            roles: user.roles,
          }
        : null,
    };
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
            fatherGothram: data.payload.family.fatherGothram || data.payload.family.gothram || 'Koundinya Gothram',
            motherGothram: data.payload.family.motherGothram || '',
            pitruChart: data.payload.family.pitruChart || {},
            acharyan: data.payload.family.acharyan || '',
            vedham: data.payload.family.vedham || '',
            suthram: data.payload.family.suthram || '',
            kuladeivam: data.payload.family.kuladeivam || '',
            nativePlace: data.payload.family.nativePlace || '',
            fatherTharpanam: data.payload.family.fatherTharpanam || {},
            motherTharpanam: data.payload.family.motherTharpanam || {},
            fatherLineage: data.payload.family.fatherLineage || [],
            motherLineage: data.payload.family.motherLineage || [],
            maternalGrandmotherLineage: data.payload.family.maternalGrandmotherLineage || [],
            members: data.payload.family.members || [],
            createdAt: new Date(),
          };
          this.dataStore.families.push(family);
        } else {
          Object.assign(family, data.payload.family);
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

      if (data.step >= 6) {
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
    const subscriptions = this.dataStore.subscriptions.filter((s) => s.customerId === customer._id).map((s) => {
      const plan = this.dataStore.plans.find((p) => p._id === s.planId);
      return { ...s, plan };
    });
    const payments = this.dataStore.payments
      .filter((p) => p.customerId === customer._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const events = this.dataStore.events.filter((e) => e.customerId === customer._id).map((e) => {
      const assignedTeamDetails: any = {};
      if (e.assignedTeam?.purohithId) assignedTeamDetails.purohith = this.dataStore.providers.find((p) => p._id === e.assignedTeam.purohithId);
      if (e.assignedTeam?.swamigal1Id) assignedTeamDetails.swamigal1 = this.dataStore.providers.find((p) => p._id === e.assignedTeam.swamigal1Id);
      if (e.assignedTeam?.swamigal2Id) assignedTeamDetails.swamigal2 = this.dataStore.providers.find((p) => p._id === e.assignedTeam.swamigal2Id);
      if (e.assignedTeam?.cookId) assignedTeamDetails.cook = this.dataStore.providers.find((p) => p._id === e.assignedTeam.cookId);
      return { ...e, assignedTeamDetails };
    });

    const totalAmountPaid = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const activeSub = subscriptions.find((s) => s.status === 'ACTIVE');
    const monthlyPrice = activeSub?.plan?.monthlyPrice || 0;
    const outstandingPayments = Math.max(0, monthlyPrice > 0 && payments.length === 0 ? monthlyPrice : 0);

    // Extract all assigned unique providers
    const assignedProvidersMap = new Map();
    events.forEach((ev) => {
      if (ev.assignedTeamDetails?.purohith) assignedProvidersMap.set(ev.assignedTeamDetails.purohith._id, ev.assignedTeamDetails.purohith);
      if (ev.assignedTeamDetails?.swamigal1) assignedProvidersMap.set(ev.assignedTeamDetails.swamigal1._id, ev.assignedTeamDetails.swamigal1);
      if (ev.assignedTeamDetails?.swamigal2) assignedProvidersMap.set(ev.assignedTeamDetails.swamigal2._id, ev.assignedTeamDetails.swamigal2);
      if (ev.assignedTeamDetails?.cook) assignedProvidersMap.set(ev.assignedTeamDetails.cook._id, ev.assignedTeamDetails.cook);
    });
    const assignedProviders = Array.from(assignedProvidersMap.values());

    // Extract all milestones
    const milestoneHistory: any[] = [];
    events.forEach((ev) => {
      if (ev.milestones && Array.isArray(ev.milestones)) {
        ev.milestones.forEach((m: any) => {
          milestoneHistory.push({
            ...m,
            eventTitle: ev.title,
            eventId: ev._id,
          });
        });
      }
    });

    // Communications / notifications
    const communications = this.dataStore.notifications.filter(
      (n) => n.userId === user?._id || n.recipientEmail === user?.email
    );

    // Enquiries
    const enquiries = (this.dataStore.enquiries || []).filter(
      (en: any) => en.email?.toLowerCase() === user?.email?.toLowerCase() || (user?.phone && en.phone?.includes(user.phone.slice(-10)))
    );

    const upcomingDates = events
      .filter((e) => new Date(e.scheduledDate).getTime() >= Date.now())
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

    return {
      customer: { ...customer, email: user?.email },
      user,
      family,
      pitruRecords,
      subscriptions,
      activeSubscription: activeSub,
      payments,
      totalAmountPaid,
      outstandingPayments,
      events,
      upcomingDates,
      assignedProviders,
      milestoneHistory,
      communications,
      enquiries,
    };
  }

  async updateCustomerAdmin(id: string, updateDto: any) {
    const customer = this.dataStore.customers.find((c) => c._id === id);
    if (!customer) throw new NotFoundException('Customer not found');

    if (updateDto.fullName) customer.fullName = updateDto.fullName;
    if (updateDto.phone) customer.phone = updateDto.phone;
    if (updateDto.altPhone !== undefined) customer.altPhone = updateDto.altPhone;
    if (updateDto.serviceCity) customer.serviceCity = updateDto.serviceCity;
    if (updateDto.address) customer.address = { ...customer.address, ...updateDto.address };
    if (updateDto.preferences) customer.preferences = updateDto.preferences;

    // Update user if needed
    const user = this.dataStore.users.find((u) => u._id === customer.userId);
    if (user) {
      if (updateDto.fullName) user.fullName = updateDto.fullName;
      if (updateDto.phone) user.phone = updateDto.phone;
      if (updateDto.email) user.email = updateDto.email.toLowerCase().trim();
    }

    // Update family if lineage is provided
    if (updateDto.family) {
      let family = this.dataStore.families.find((f) => f.customerId === customer._id);
      if (family) {
        Object.assign(family, updateDto.family);
      }
    }

    return { success: true, customer };
  }

  async deleteCustomerAdmin(id: string) {
    const custIdx = this.dataStore.customers.findIndex((c) => c._id === id);
    if (custIdx === -1) throw new NotFoundException('Customer not found');

    const customer = this.dataStore.customers[custIdx];
    this.dataStore.customers.splice(custIdx, 1);

    // Cleanup linked entities
    this.dataStore.families = this.dataStore.families.filter((f) => f.customerId !== id);
    this.dataStore.pitruRecords = this.dataStore.pitruRecords.filter((p) => p.customerId !== id);
    this.dataStore.subscriptions = this.dataStore.subscriptions.filter((s) => s.customerId !== id);
    this.dataStore.payments = this.dataStore.payments.filter((p) => p.customerId !== id);
    this.dataStore.events = this.dataStore.events.filter((e) => e.customerId !== id);

    // Inactivate user
    const user = this.dataStore.users.find((u) => u._id === customer.userId);
    if (user) {
      user.isActive = false;
    }

    return { success: true, message: `Customer ${customer.fullName} deleted successfully.` };
  }
}
