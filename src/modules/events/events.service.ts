import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { EventStatus } from '../../schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMyEvents(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) return [];
    return this.dataStore.events
      .filter((e) => e.customerId === customer._id)
      .map((e) => this.enrichEvent(e));
  }

  async getAllEvents() {
    return this.dataStore.events.map((e) => this.enrichEvent(e));
  }

  async getEventById(id: string) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
    return this.enrichEvent(event);
  }

  async updateEventStatus(id: string, status: EventStatus) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
    event.status = status;
    if (status === EventStatus.COMPLETED) {
      event.completedAt = new Date();
    }
    return this.enrichEvent(event);
  }

  async updateChecklist(id: string, itemIndex: number, isCompleted: boolean) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.checklist && event.checklist[itemIndex]) {
      event.checklist[itemIndex].isCompleted = isCompleted;
      event.checklist[itemIndex].completedAt = isCompleted ? new Date() : null;
    }
    return this.enrichEvent(event);
  }

  private enrichEvent(e: any) {
    const customer = this.dataStore.customers.find((c) => c._id === e.customerId);
    const pitruRecord = this.dataStore.pitruRecords.find((p) => p._id === e.pitruRecordId);
    const plan = this.dataStore.plans.find((p) => p._id === e.planId);
    const assignments = this.dataStore.assignments.filter((a) => a.eventId === e._id);
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
      customer,
      pitruRecord,
      plan,
      assignments,
      assignedTeamDetails,
    };
  }
}
