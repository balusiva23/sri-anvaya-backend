import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { AssignmentStatus } from '../../schemas/assignment.schema';
import { EventStatus } from '../../schemas/event.schema';
import { WalletTxType } from '../../schemas/wallet.schema';

@Injectable()
export class AssignmentsService {
  private readonly logger = new Logger(AssignmentsService.name);

  constructor(private readonly dataStore: DataStoreService) {}

  async getMyAssignments(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const assignments = this.dataStore.assignments.filter((a) => a.providerId === provider._id);
    return assignments.map((asg) => {
      const event = this.dataStore.events.find((e) => e._id === asg.eventId);
      const customer = event ? this.dataStore.customers.find((c) => c._id === event.customerId) : null;
      const pitruRecord = event ? this.dataStore.pitruRecords.find((p) => p._id === event.pitruRecordId) : null;
      return {
        ...asg,
        event: event ? { ...event, customer, pitruRecord } : null,
      };
    });
  }

  async assignTeam(eventId: string, team: {
<<<<<<< HEAD
    purohithId?: string;
    swamigal1Id?: string;
    swamigal2Id?: string;
    cookId?: string;
=======
    purohithId: string;
    swamigal1Id: string;
    swamigal2Id: string;
    cookId: string;
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  }) {
    const event = this.dataStore.events.find((e) => e._id === eventId);
    if (!event) throw new NotFoundException('Event not found');

<<<<<<< HEAD
    if (!event.assignedTeam) event.assignedTeam = {};
    if (team.purohithId !== undefined) event.assignedTeam.purohithId = team.purohithId;
    if (team.swamigal1Id !== undefined) event.assignedTeam.swamigal1Id = team.swamigal1Id;
    if (team.swamigal2Id !== undefined) event.assignedTeam.swamigal2Id = team.swamigal2Id;
    if (team.cookId !== undefined) event.assignedTeam.cookId = team.cookId;

    const allFourAssigned =
      !!event.assignedTeam.purohithId &&
      !!event.assignedTeam.swamigal1Id &&
      !!event.assignedTeam.swamigal2Id &&
      !!event.assignedTeam.cookId;

    // Requirement 17: Once admin assigns all four providers, status automatically changes to Assigned
    if (allFourAssigned) {
      event.status = EventStatus.ASSIGNED;
    } else {
      event.status = EventStatus.PROVIDER_ASSIGNMENT;
    }

    const chk = event.checklist?.find((c: any) => c.item === 'Vedic Vadhyar & Swamigals Assigned');
    if (chk) {
      chk.isCompleted = true;
      chk.completedAt = new Date();
    }

    // Update milestones
    if (!event.milestones) event.milestones = [];
    const existingM = event.milestones.find((m: any) => m.id === 'm_team_assigned');
    if (existingM) {
      existingM.status = allFourAssigned ? 'COMPLETED' : 'IN_PROGRESS';
      existingM.timestamp = new Date();
      existingM.remarks = allFourAssigned ? 'Full 4-member Vedic team assigned' : 'Partial team assignment in progress';
    } else {
      event.milestones.push({
        id: 'm_team_assigned',
        name: 'Vedic Team Assigned',
        status: allFourAssigned ? 'COMPLETED' : 'IN_PROGRESS',
        timestamp: new Date(),
        remarks: allFourAssigned ? 'Full 4-member Vedic team assigned' : 'Partial team assignment in progress',
      });
    }

    const customer = this.dataStore.customers.find((c) => c._id === event.customerId);
    const locationStr = event.location?.address
      ? `${event.location.address}, ${event.location.city || ''}`
      : customer?.address?.city || 'Customer Location';
    const eventRef = `EVT-${event._id.slice(-6).toUpperCase()}`;
=======
    event.assignedTeam = team;
    event.status = EventStatus.PROVIDER_ASSIGNMENT;
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3

    const teamEntries = [
      { providerId: team.purohithId, role: 'PUROHITH', gross: 3500 },
      { providerId: team.swamigal1Id, role: 'SWAMIGAL_1', gross: 2500 },
      { providerId: team.swamigal2Id, role: 'SWAMIGAL_2', gross: 2500 },
      { providerId: team.cookId, role: 'COOK', gross: 3000 },
    ];

    for (const member of teamEntries) {
      if (!member.providerId) continue;
      // Remove old assignment if any
      const existingIdx = this.dataStore.assignments.findIndex(
        (a) => a.eventId === eventId && a.roleInEvent === member.role,
      );
      if (existingIdx !== -1) {
        this.dataStore.assignments.splice(existingIdx, 1);
      }

      const newAssignment = {
        _id: `asg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventId,
        providerId: member.providerId,
        roleInEvent: member.role,
        status: AssignmentStatus.ASSIGNED,
        grossRemuneration: member.gross,
        assignedAt: new Date(),
      };
      this.dataStore.assignments.push(newAssignment);

<<<<<<< HEAD
      // Requirement 18: Immediate notification with rich event details, scheduled date, location, reference & instructions
      const provider = this.dataStore.providers.find((p) => p._id === member.providerId);
      if (provider) {
        this.dataStore.notifications.unshift({
          _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          userId: provider.userId,
          channel: 'IN_APP',
          category: 'ASSIGNMENT',
          title: `New Assignment: ${member.role} [${eventRef}]`,
          message: `You have been assigned as ${member.role} for ceremony '${event.title}' on ${new Date(event.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at ${locationStr}. Ref: ${eventRef}. Instructions: ${event.notes || 'Please arrive at customer location 30 minutes prior with sacred veshti and Angavastram.'}`,
=======
      // Notify provider
      const provider = this.dataStore.providers.find((p) => p._id === member.providerId);
      if (provider) {
        this.dataStore.notifications.push({
          _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          userId: provider.userId,
          channel: 'IN_APP',
          title: `New Assignment: ${event.title}`,
          message: `You have been assigned as ${member.role} for Sradham on ${new Date(event.scheduledDate).toLocaleDateString()}. Please confirm.`,
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
          status: 'DELIVERED',
          isRead: false,
          createdAt: new Date(),
        });
      }
    }

    return {
      success: true,
      event,
      assignments: this.dataStore.assignments.filter((a) => a.eventId === eventId),
    };
  }

  async respondToAssignment(userId: string, assignmentId: string, status: 'ACCEPTED' | 'REJECTED', reason?: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const assignment = this.dataStore.assignments.find((a) => a._id === assignmentId && a.providerId === provider._id);
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.status = status === 'ACCEPTED' ? AssignmentStatus.ACCEPTED : AssignmentStatus.REJECTED;
    assignment.respondedAt = new Date();
    if (reason) assignment.rejectionReason = reason;

    // Check if all assigned providers for this event have accepted
    const eventAssignments = this.dataStore.assignments.filter((a) => a.eventId === assignment.eventId);
    const allAccepted = eventAssignments.length >= 4 && eventAssignments.every((a) => a.status === AssignmentStatus.ACCEPTED);
    if (allAccepted) {
      const event = this.dataStore.events.find((e) => e._id === assignment.eventId);
      if (event && event.status === EventStatus.PROVIDER_ASSIGNMENT) {
        event.status = EventStatus.READY;
      }
    }

    return assignment;
  }

  async markArrived(userId: string, assignmentId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const assignment = this.dataStore.assignments.find((a) => a._id === assignmentId && a.providerId === provider._id);
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.status = AssignmentStatus.ARRIVED;
    assignment.arrivedAt = new Date();

    const event = this.dataStore.events.find((e) => e._id === assignment.eventId);
    if (event) {
      event.status = EventStatus.EVENT_DAY;
      // Mark arrival in checklist
      const arrivalItem = event.checklist.find((c: any) => c.item.includes('Arrival'));
      if (arrivalItem) {
        arrivalItem.isCompleted = true;
        arrivalItem.completedAt = new Date();
      }
    }

    return assignment;
  }

  async completeService(userId: string, assignmentId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const assignment = this.dataStore.assignments.find((a) => a._id === assignmentId && a.providerId === provider._id);
    if (!assignment) throw new NotFoundException('Assignment not found');

    assignment.status = AssignmentStatus.COMPLETED;
    assignment.completedAt = new Date();

    // Check welfare percentage setting (default 12%)
    const welfareSetting = this.dataStore.systemSettings.find((s) => s.key === 'DEFAULT_WELFARE_PERCENTAGE');
    const welfarePercentage = welfareSetting?.value || 12;

    const gross = assignment.grossRemuneration || 3000;
    const welfareAmount = Math.round((gross * welfarePercentage) / 100);
    const netDirectPayout = gross - welfareAmount;

    // Record Provider Earning
    const earning = {
      _id: `earn_${Date.now()}`,
      providerId: provider._id,
      eventId: assignment.eventId,
      assignmentId: assignment._id,
      grossAmount: gross,
      welfarePercentage,
      welfareAmount,
      netDirectPayout,
      payoutStatus: 'PAID',
      payoutReference: `PAYOUT-SA-${Date.now().toString().slice(-6)}`,
      createdAt: new Date(),
    };
    this.dataStore.earnings.push(earning);

    // Update Provider Welfare Wallet
    let wallet = this.dataStore.wallets.find((w) => w.providerId === provider._id);
    if (!wallet) {
      wallet = {
        _id: `wal_${Date.now()}`,
        providerId: provider._id,
        currentBalance: 0,
        lifetimeAllocated: 0,
        lifetimeDisbursed: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
      };
      this.dataStore.wallets.push(wallet);
    }

    wallet.currentBalance += welfareAmount;
    wallet.lifetimeAllocated += welfareAmount;

    // Create Wallet Transaction
    this.dataStore.walletTransactions.push({
      _id: `wtx_${Date.now()}`,
      walletId: wallet._id,
      providerId: provider._id,
      eventId: assignment.eventId,
      amount: welfareAmount,
      type: WalletTxType.CREDIT_ALLOCATION,
      description: `${welfarePercentage}% Welfare Allocation from Event completion (${assignment.roleInEvent})`,
      status: 'COMPLETED',
      createdAt: new Date(),
    });

    provider.completedEventsCount = (provider.completedEventsCount || 0) + 1;

    // Check if event is fully completed
    const allAssignments = this.dataStore.assignments.filter((a) => a.eventId === assignment.eventId);
    const allDone = allAssignments.every((a) => a.status === AssignmentStatus.COMPLETED);
    if (allDone) {
      const event = this.dataStore.events.find((e) => e._id === assignment.eventId);
      if (event) {
        event.status = EventStatus.COMPLETED;
        event.completedAt = new Date();
        event.checklist.forEach((c: any) => (c.isCompleted = true));
      }
    }

    return {
      assignment,
      earning,
      wallet,
    };
  }
}
