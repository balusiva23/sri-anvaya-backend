import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class PitruService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMyPitruRecords(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer not found');
    return this.dataStore.pitruRecords.filter((p) => p.customerId === customer._id);
  }

  async createPitruRecord(userId: string, data: any) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer not found');

    const newRecord = {
      _id: `pitru_${Date.now()}`,
      customerId: customer._id,
      karthaName: data.karthaName || customer.fullName,
      pitruName: data.pitruName,
      relationship: data.relationship,
      calendarType: data.calendarType || 'Chandramana',
      masa: data.masa || '',
      paksha: data.paksha || '',
      tithi: data.tithi || '',
      nakshatra: data.nakshatra || '',
      englishDate: data.englishDate ? new Date(data.englishDate) : new Date(),
      annualDateNotes: data.annualDateNotes || '',
      notes: data.notes || '',
      documentUrls: data.documentUrls || [],
      createdAt: new Date(),
    };

    this.dataStore.pitruRecords.push(newRecord);

    // Auto-create annual event
    const newEvent = {
      _id: `evt_${Date.now()}`,
      customerId: customer._id,
      pitruRecordId: newRecord._id,
      title: `Annual Sradham - ${newRecord.pitruName}`,
      scheduledDate: newRecord.englishDate,
      status: 'PLANNING',
      location: {
        venueType: 'HOME',
        address: customer.address?.line1 || '',
        city: customer.serviceCity || 'Chennai',
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
      notes: newRecord.notes,
      createdAt: new Date(),
    };
    this.dataStore.events.push(newEvent);

    return newRecord;
  }

  async updatePitruRecord(user: any, id: string, data: any) {
    const isAdmin = user.roles?.some((r: string) => ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS'].includes(r));
    let record: any = null;

    if (isAdmin) {
      record = this.dataStore.pitruRecords.find((p) => p._id === id);
    } else {
      const customer = this.dataStore.customers.find((c) => c.userId === user.userId);
      if (!customer) throw new NotFoundException('Customer not found');
      record = this.dataStore.pitruRecords.find((p) => p._id === id && p.customerId === customer._id);
    }

    if (!record) throw new NotFoundException('Pitru record not found');

    if (data.pitruName !== undefined) record.pitruName = data.pitruName;
    if (data.relationship !== undefined) record.relationship = data.relationship;
    if (data.calendarType !== undefined) record.calendarType = data.calendarType;
    if (data.masa !== undefined) record.masa = data.masa;
    if (data.paksha !== undefined) record.paksha = data.paksha;
    if (data.tithi !== undefined) record.tithi = data.tithi;
    if (data.nakshatra !== undefined) record.nakshatra = data.nakshatra;
    if (data.annualDateNotes !== undefined) record.annualDateNotes = data.annualDateNotes;
    if (data.notes !== undefined) record.notes = data.notes;
    if (data.englishDate) {
      record.englishDate = new Date(data.englishDate);
    }

    // Also sync linked event
    const linkedEvent = this.dataStore.events.find((e) => e.pitruRecordId === id);
    if (linkedEvent) {
      if (record.pitruName) linkedEvent.title = `Annual Sradham - ${record.pitruName}`;
      if (record.englishDate) linkedEvent.scheduledDate = record.englishDate;
      if (record.notes) linkedEvent.notes = record.notes;
    }

    return record;
  }

  async deletePitruRecord(user: any, id: string) {
    const isAdmin = user.roles?.some((r: string) => ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS'].includes(r));
    let idx = -1;

    if (isAdmin) {
      idx = this.dataStore.pitruRecords.findIndex((p) => p._id === id);
    } else {
      const customer = this.dataStore.customers.find((c) => c.userId === user.userId);
      if (!customer) throw new NotFoundException('Customer not found');
      idx = this.dataStore.pitruRecords.findIndex((p) => p._id === id && p.customerId === customer._id);
    }

    if (idx === -1) throw new NotFoundException('Pitru record not found');

    this.dataStore.pitruRecords.splice(idx, 1);
    this.dataStore.events = this.dataStore.events.filter((e) => e.pitruRecordId !== id);

    return { success: true, message: 'Pitru record removed successfully' };
  }
}
