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
<<<<<<< HEAD
      .map((e) => this.enrichEvent(e, true));
  }

  async getAllEvents() {
    return this.dataStore.events.map((e) => this.enrichEvent(e, false));
=======
      .map((e) => this.enrichEvent(e));
  }

  async getAllEvents() {
    return this.dataStore.events.map((e) => this.enrichEvent(e));
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  }

  async getEventById(id: string) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
<<<<<<< HEAD
    return this.enrichEvent(event, false);
=======
    return this.enrichEvent(event);
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  }

  async updateEventStatus(id: string, status: EventStatus) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
    event.status = status;
    if (status === EventStatus.COMPLETED) {
      event.completedAt = new Date();
<<<<<<< HEAD
      // Auto-complete all milestones
      if (event.milestones) {
        event.milestones.forEach((m: any) => {
          m.status = 'COMPLETED';
          if (!m.timestamp) m.timestamp = new Date();
        });
      }
    }
    return this.enrichEvent(event, false);
=======
    }
    return this.enrichEvent(event);
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  }

  async updateChecklist(id: string, itemIndex: number, isCompleted: boolean) {
    const event = this.dataStore.events.find((e) => e._id === id);
    if (!event) throw new NotFoundException('Event not found');
    if (event.checklist && event.checklist[itemIndex]) {
      event.checklist[itemIndex].isCompleted = isCompleted;
      event.checklist[itemIndex].completedAt = isCompleted ? new Date() : null;
    }
<<<<<<< HEAD
    return this.enrichEvent(event, false);
  }

  async updateMilestone(
    eventId: string,
    milestoneId: string,
    status: string,
    remarks?: string,
    completedBy?: string,
  ) {
    const event = this.dataStore.events.find((e) => e._id === eventId);
    if (!event) throw new NotFoundException('Event not found');

    if (!event.milestones || !Array.isArray(event.milestones)) {
      event.milestones = this.getDefaultMilestones(event);
    }

    let milestone = event.milestones.find((m: any) => m.id === milestoneId);
    if (!milestone) {
      milestone = {
        id: milestoneId,
        name: milestoneId,
        status: status || 'COMPLETED',
        timestamp: new Date(),
        remarks: remarks || '',
        completedBy: completedBy || 'Admin',
      };
      event.milestones.push(milestone);
    } else {
      milestone.status = status;
      milestone.timestamp = new Date();
      if (remarks !== undefined) milestone.remarks = remarks;
      if (completedBy) milestone.completedBy = completedBy;
    }

    return this.enrichEvent(event, false);
  }

  private getDefaultMilestones(e: any) {
    const hasPurohith = !!e.assignedTeam?.purohithId;
    const hasFullTeam = hasPurohith && !!e.assignedTeam?.swamigal1Id && !!e.assignedTeam?.swamigal2Id && !!e.assignedTeam?.cookId;
    const isReady = e.status === 'READY' || e.status === 'ASSIGNED';
    const isCompleted = e.status === 'COMPLETED';

    return [
      {
        id: 'm1_tithi_confirmed',
        name: 'Tithi & Date Confirmed',
        status: 'COMPLETED',
        timestamp: e.createdAt || new Date(),
        remarks: 'Computed via Vedic Panchangam vidwans',
      },
      {
        id: 'm2_team_assigned',
        name: 'Purohith & Team Assigned',
        status: hasFullTeam ? 'COMPLETED' : hasPurohith ? 'IN_PROGRESS' : 'PENDING',
        timestamp: hasPurohith ? new Date() : undefined,
        remarks: hasFullTeam ? '4-Member Team Assigned' : hasPurohith ? 'Purohith Assigned' : 'Assignment Pending',
      },
      {
        id: 'm3_samagri_dispatched',
        name: 'Samagri Kit Dispatched',
        status: e.samagriKitProvided ? 'COMPLETED' : 'PENDING',
        timestamp: e.samagriKitProvided ? new Date() : undefined,
        remarks: 'Traditional samagri package prepared',
      },
      {
        id: 'm4_arrival',
        name: 'Provider Arrival at Customer Location',
        status: isCompleted ? 'COMPLETED' : isReady ? 'IN_PROGRESS' : 'PENDING',
        timestamp: isCompleted ? new Date() : undefined,
        remarks: 'Reported to customer location',
      },
      {
        id: 'm5_sankalpam',
        name: 'Sankalpam & Homam Started',
        status: isCompleted ? 'COMPLETED' : 'PENDING',
        timestamp: isCompleted ? new Date() : undefined,
        remarks: 'Pradhana Homam & Pinda Pradanam',
      },
      {
        id: 'm6_bhojanam',
        name: 'Brahmana Bhojanam Completed',
        status: isCompleted ? 'COMPLETED' : 'PENDING',
        timestamp: isCompleted ? new Date() : undefined,
        remarks: 'Traditional sacred meal served',
      },
      {
        id: 'm7_completion',
        name: 'Dakshina & Ceremony Completed',
        status: isCompleted ? 'COMPLETED' : 'PENDING',
        timestamp: isCompleted ? (e.completedAt || new Date()) : undefined,
        remarks: 'Final blessings & receipt sign-off',
      },
    ];
  }

  private enrichEvent(e: any, isCustomerView: boolean = false) {
=======
    return this.enrichEvent(event);
  }

  private enrichEvent(e: any) {
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
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

<<<<<<< HEAD
    // Ensure milestones exist
    if (!e.milestones || !Array.isArray(e.milestones) || e.milestones.length === 0) {
      e.milestones = this.getDefaultMilestones(e);
    }

    // Requirement 16: Categorize events into New, Pending, Completed
    let category: 'NEW' | 'PENDING' | 'COMPLETED' = 'PENDING';
    if (e.status === EventStatus.COMPLETED || e.status === EventStatus.CANCELLED) {
      category = 'COMPLETED';
    } else if (
      e.status === EventStatus.PLANNING &&
      !e.assignedTeam?.purohithId &&
      !e.assignedTeam?.cookId
    ) {
      category = 'NEW';
    } else {
      category = 'PENDING';
    }

    // Requirement 14: Customer progress updates without exposing internal checklist
    const customerProgress = [
      {
        step: 'Purohith Assigned',
        isCompleted: !!e.assignedTeam?.purohithId,
        details: e.assignedTeam?.purohithId ? `${assignedTeamDetails.purohith?.fullName || 'Assigned'}` : 'Provider Assignment Pending',
      },
      {
        step: 'Swamigals Assigned',
        isCompleted: !!e.assignedTeam?.swamigal1Id && !!e.assignedTeam?.swamigal2Id,
        details: (e.assignedTeam?.swamigal1Id && e.assignedTeam?.swamigal2Id) ? '2 Vedic Swamigals confirmed' : 'Provider Assignment Pending',
      },
      {
        step: 'Cook Assigned',
        isCompleted: !!e.assignedTeam?.cookId,
        details: e.assignedTeam?.cookId ? `${assignedTeamDetails.cook?.fullName || 'Traditional Madi Cook confirmed'}` : 'Provider Assignment Pending',
      },
      {
        step: 'Event Preparation Started',
        isCompleted: e.status === EventStatus.READY || e.status === EventStatus.ASSIGNED || e.status === EventStatus.EVENT_DAY || e.status === EventStatus.COMPLETED,
        details: 'Samagri and logistics preparation initiated',
      },
      {
        step: 'Event In Progress',
        isCompleted: e.status === EventStatus.EVENT_DAY || e.status === EventStatus.COMPLETED,
        details: 'Ceremonial rituals underway',
      },
      {
        step: 'Event Completed',
        isCompleted: e.status === EventStatus.COMPLETED,
        details: e.completedAt ? `Ceremony completed successfully` : 'Pending completion',
      },
    ];

    if (isCustomerView) {
      const { checklist, ...rest } = e;
      return {
        ...rest,
        category,
        customer,
        pitruRecord,
        plan,
        customerProgress,
        assignedTeamDetails: {
          purohith: assignedTeamDetails.purohith ? { fullName: assignedTeamDetails.purohith.fullName, rating: assignedTeamDetails.purohith.rating } : null,
          swamigal1: assignedTeamDetails.swamigal1 ? { fullName: assignedTeamDetails.swamigal1.fullName } : null,
          swamigal2: assignedTeamDetails.swamigal2 ? { fullName: assignedTeamDetails.swamigal2.fullName } : null,
          cook: assignedTeamDetails.cook ? { fullName: assignedTeamDetails.cook.fullName } : null,
        },
      };
    }

    return {
      ...e,
      category,
=======
    return {
      ...e,
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
      customer,
      pitruRecord,
      plan,
      assignments,
      assignedTeamDetails,
<<<<<<< HEAD
      customerProgress,
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
    };
  }
}
