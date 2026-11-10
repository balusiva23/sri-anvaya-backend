import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { ProviderRole } from '../../schemas/provider.schema';
import { AssignmentStatus } from '../../schemas/assignment.schema';
import { EventStatus } from '../../schemas/event.schema';

@Injectable()
export class ProvidersService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getAllProviders(role?: ProviderRole, city?: string) {
    return this.dataStore.providers.filter((p) => {
      if (role && p.role !== role) return false;
      if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
      return true;
    });
  }

  async getProviderProfile(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');
    const user = this.dataStore.users.find((u) => u._id === userId);
    const wallet = this.dataStore.wallets.find((w) => w.providerId === provider._id);
    const earnings = this.dataStore.earnings.filter((e) => e.providerId === provider._id);
    const assignments = this.dataStore.assignments.filter((a) => a.providerId === provider._id);

    // Ensure default bankDetails and vedicDetails
    if (!provider.bankDetails) {
      provider.bankDetails = {
        accountNumber: 'XXXXXX9821',
        ifscCode: 'HDFC0000124',
        bankName: 'HDFC Bank, Mylapore',
        accountHolderName: provider.fullName,
        upiId: 'krishna.vadhyar@okaxis',
      };
    }

    if (!provider.vedicDetails) {
      provider.vedicDetails = {
        veda: 'Krishna Yajur Veda',
        shakha: 'Taittiriya',
        sutram: 'Apastamba',
        gothram: 'Koundinya',
        sampradayam: 'Vadama Smartha',
        patashala: 'The Madras Sanskrit College',
        yearsOfExperience: 20,
        bio: 'Orthodox Smartha Vadhyar with over 20 years of dedication to Shroutha & Smartha karmas, Annual Sradhams, and Veda Parayanam.',
      };
    }

    return {
      provider: {
        ...provider,
        email: user?.email,
      },
      wallet,
      earnings,
      assignments,
    };
  }

  async updateProviderProfile(userId: string, data: any) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');

    const user = this.dataStore.users.find((u) => u._id === userId);

    if (data.fullName && data.fullName.trim()) {
      provider.fullName = data.fullName.trim();
      if (user) user.fullName = data.fullName.trim();
    }

    if (data.phone && data.phone.trim()) {
      provider.phone = data.phone.trim();
      if (user) user.phone = data.phone.trim();
    }

    if (data.city && data.city.trim()) {
      provider.city = data.city.trim();
    }

    if (data.serviceLocations !== undefined) {
      if (Array.isArray(data.serviceLocations)) {
        provider.serviceLocations = data.serviceLocations.map((s: string) => s.trim()).filter(Boolean);
      } else if (typeof data.serviceLocations === 'string') {
        provider.serviceLocations = data.serviceLocations
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }

    if (data.bankDetails) {
      provider.bankDetails = {
        accountNumber:
          data.bankDetails.accountNumber !== undefined
            ? String(data.bankDetails.accountNumber).trim()
            : provider.bankDetails?.accountNumber || '',
        ifscCode:
          data.bankDetails.ifscCode !== undefined
            ? String(data.bankDetails.ifscCode).trim().toUpperCase()
            : provider.bankDetails?.ifscCode || '',
        bankName:
          data.bankDetails.bankName !== undefined
            ? String(data.bankDetails.bankName).trim()
            : provider.bankDetails?.bankName || '',
        accountHolderName:
          data.bankDetails.accountHolderName !== undefined
            ? String(data.bankDetails.accountHolderName).trim()
            : provider.bankDetails?.accountHolderName || provider.fullName,
        upiId:
          data.bankDetails.upiId !== undefined
            ? String(data.bankDetails.upiId).trim()
            : provider.bankDetails?.upiId || '',
      };
    }

    if (data.vedicDetails) {
      provider.vedicDetails = {
        veda: data.vedicDetails.veda ?? provider.vedicDetails?.veda ?? 'Krishna Yajur Veda',
        shakha: data.vedicDetails.shakha ?? provider.vedicDetails?.shakha ?? 'Taittiriya',
        sutram: data.vedicDetails.sutram ?? provider.vedicDetails?.sutram ?? 'Apastamba',
        gothram: data.vedicDetails.gothram ?? provider.vedicDetails?.gothram ?? 'Koundinya',
        sampradayam: data.vedicDetails.sampradayam ?? provider.vedicDetails?.sampradayam ?? 'Vadama Smartha',
        patashala: data.vedicDetails.patashala ?? provider.vedicDetails?.patashala ?? 'The Madras Sanskrit College',
        yearsOfExperience: data.vedicDetails.yearsOfExperience ?? provider.vedicDetails?.yearsOfExperience ?? 20,
        bio: data.vedicDetails.bio ?? provider.vedicDetails?.bio ?? '',
      };
    }

    if (data.role && ['PUROHITH', 'SWAMIGAL', 'COOK', 'SPECIALIST'].includes(data.role)) {
      provider.role = data.role;
    }

    return {
      success: true,
      provider: {
        ...provider,
        email: user?.email,
      },
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

  async updateAvailability(userId: string, isAvailable: boolean, unavailableDates?: string[]) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');

    provider.isAvailable = isAvailable;
    if (unavailableDates) {
      provider.unavailableDates = unavailableDates.map((d) => new Date(d));
    }
    return provider;
  }

  async updateProviderStatus(id: string, status: string, notes?: string) {
    const provider = this.dataStore.providers.find((p) => p._id === id);
    if (!provider) throw new NotFoundException('Provider not found');

    const normalizedStatus = status === 'APPROVED' ? 'VERIFIED' : status;
    provider.verificationStatus = normalizedStatus;
    if (normalizedStatus === 'VERIFIED') {
      provider.isAvailable = true;
    } else if (normalizedStatus === 'REJECTED') {
      provider.isAvailable = false;
    }
    if (notes) {
      provider.adminNotes = notes;
    }

    // Send notification to provider
    this.dataStore.notifications.unshift({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: provider.userId,
      channel: 'IN_APP',
      category: 'ADMIN_ANNOUNCEMENT',
      title: normalizedStatus === 'VERIFIED' ? 'Account Approved & Activated!' : 'Account Verification Update',
      message: normalizedStatus === 'VERIFIED'
        ? 'Congratulations! Your Vedic service provider account has been approved by Sri Anvaya Administration. You are now eligible to receive ritual assignments.'
        : `Your registration status has been updated to: ${normalizedStatus}. ${notes || ''}`,
      status: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    return { success: true, provider };
  }

  // 1. Provider Books His Own Work
  async bookOwnWork(userId: string, data: any) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    if (!data.title || !data.scheduledDate) {
      throw new BadRequestException('Ritual title and scheduled date are required.');
    }

    const eventId = `evt_self_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const scheduledDate = new Date(data.scheduledDate);

    const event: any = {
      _id: eventId,
      isSelfBooked: true,
      leadProviderId: provider._id,
      createdByProviderId: provider._id,
      createdByProviderName: provider.fullName,
      title: data.title,
      scheduledDate,
      time: data.time || '07:30 AM - 11:30 AM',
      status: EventStatus.ASSIGNED,
      location: {
        venueType: data.venueType || 'HOME',
        address: data.address || 'Client Residence',
        city: data.city || provider.city || 'Chennai',
      },
      dakshina: Number(data.dakshina) || 5000,
      notes: data.notes || '',
      samagriKitProvided: data.samagriKitProvided !== false,
      clientDetails: {
        name: data.clientName || 'Private Client',
        phone: data.clientPhone || '+91 98840 00000',
      },
      assignedTeam: {
        purohithId: provider._id,
      },
      checklist: [
        { item: 'Client Confirmation & Sankalpam Details Verified', isCompleted: true, completedAt: new Date() },
        { item: 'Venue Address & Muhurtham Timings Confirmed', isCompleted: true, completedAt: new Date() },
        { item: 'Vedic Samagri Kit & Pavitram Prepared', isCompleted: true, completedAt: new Date() },
        { item: 'Team Members & Assistants Confirmed', isCompleted: false },
        { item: 'Venue Arrival & Pinda Pradanam / Homam Conducted', isCompleted: false },
        { item: 'Brahmana Bhojanam & Dakshina Received', isCompleted: false },
      ],
      createdAt: new Date(),
    };

    this.dataStore.events.unshift(event);

    // Auto-create assignment for the provider
    const assignmentId = `asg_self_${Date.now()}`;
    const assignment: any = {
      _id: assignmentId,
      eventId: event._id,
      providerId: provider._id,
      roleInEvent: provider.role || 'PUROHITH',
      status: AssignmentStatus.ACCEPTED,
      grossRemuneration: Number(data.dakshina) || 5000,
      assignedAt: new Date(),
      isSelfBooked: true,
    };

    this.dataStore.assignments.unshift(assignment);

    // Create confirmation notification
    this.dataStore.notifications.unshift({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: provider.userId,
      channel: 'IN_APP',
      category: 'SERVICE_ASSIGNMENT',
      title: 'Work Booking Confirmed',
      message: `You have successfully booked "${data.title}" on ${scheduledDate.toLocaleDateString()} for ${event.clientDetails.name}.`,
      status: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    return { success: true, event, assignment };
  }

  // 2. Provider Calendar (Works, Assignments & Daily Notes)
  async getProviderCalendar(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    // Get all assignments for this provider
    const myAssignments = this.dataStore.assignments.filter((a) => a.providerId === provider._id);
    const assignedEventIds = new Set(myAssignments.map((a) => a.eventId));

    // Also get all events created by this provider (even if delegated to team members)
    const allRelevantEvents = this.dataStore.events.filter(
      (e) => assignedEventIds.has(e._id) || e.createdByProviderId === provider._id,
    );

    const enrichedEvents = allRelevantEvents.map((evt) => {
      const asg = myAssignments.find((a) => a.eventId === evt._id);
      const customer = evt.customerId ? this.dataStore.customers.find((c) => c._id === evt.customerId) : null;
      const pitru = evt.pitruRecordId ? this.dataStore.pitruRecords.find((p) => p._id === evt.pitruRecordId) : null;

      // Find other team members assigned to this event
      const teamDetails: any = {};
      if (evt.assignedTeam?.purohithId) {
        teamDetails.purohith = this.dataStore.providers.find((p) => p._id === evt.assignedTeam.purohithId);
      }
      if (evt.assignedTeam?.swamigal1Id) {
        teamDetails.swamigal1 = this.dataStore.providers.find((p) => p._id === evt.assignedTeam.swamigal1Id);
      }
      if (evt.assignedTeam?.swamigal2Id) {
        teamDetails.swamigal2 = this.dataStore.providers.find((p) => p._id === evt.assignedTeam.swamigal2Id);
      }
      if (evt.assignedTeam?.cookId) {
        teamDetails.cook = this.dataStore.providers.find((p) => p._id === evt.assignedTeam.cookId);
      }

      return {
        ...evt,
        myAssignment: asg,
        customer,
        pitruRecord: pitru,
        teamDetails,
      };
    });

    return {
      provider,
      events: enrichedEvents,
      notes: provider.calendarNotes || [],
      unavailableDates: provider.unavailableDates || [],
    };
  }

  // Save / Update a personal date note on Provider's calendar
  async saveCalendarNote(userId: string, date: string, note: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    if (!provider.calendarNotes) provider.calendarNotes = [];

    const existingIdx = provider.calendarNotes.findIndex((n: any) => n.date === date);
    if (existingIdx !== -1) {
      if (!note || note.trim() === '') {
        provider.calendarNotes.splice(existingIdx, 1);
      } else {
        provider.calendarNotes[existingIdx].note = note;
        provider.calendarNotes[existingIdx].updatedAt = new Date();
      }
    } else if (note && note.trim() !== '') {
      provider.calendarNotes.push({
        id: `note_${Date.now()}`,
        date,
        note,
        createdAt: new Date(),
      });
    }

    return { success: true, notes: provider.calendarNotes };
  }

  // 4. Provider Team Management
  async getProviderTeam(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    if (!provider.team) {
      provider.team = {
        teamName: `${provider.fullName}'s Vaadeeka Brundam`,
        description: 'Vedic Vadhyars, Swamigals, and Traditional Madi Cooks.',
        memberIds: [],
      };
    }

    // Default seed prov2, prov3, prov4 into prov1's team if empty for immediate demo richness
    if (provider._id === 'prov_1' && (!provider.team.memberIds || provider.team.memberIds.length === 0)) {
      provider.team.memberIds = ['prov_2', 'prov_3', 'prov_4'];
    }

    // Enrich member objects
    const members = (provider.team.memberIds || [])
      .map((id: string) => this.dataStore.providers.find((p) => p._id === id))
      .filter(Boolean);

    // Available registered vaadyars (not in team and not self)
    const existingIds = new Set([provider._id, ...(provider.team.memberIds || [])]);
    const availableVaadyars = this.dataStore.providers.filter((p) => !existingIds.has(p._id));

    return {
      team: {
        ...provider.team,
        members,
      },
      availableVaadyars,
    };
  }

  async updateProviderTeam(userId: string, data: { teamName: string; description?: string }) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    if (!provider.team) {
      provider.team = {
        teamName: data.teamName,
        description: data.description || '',
        memberIds: [],
      };
    } else {
      provider.team.teamName = data.teamName;
      if (data.description !== undefined) provider.team.description = data.description;
    }

    return provider.team;
  }

  async addTeamMember(userId: string, memberProviderId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const memberProvider = this.dataStore.providers.find((p) => p._id === memberProviderId);
    if (!memberProvider) throw new NotFoundException('Registered Vaadyar not found');

    if (!provider.team) {
      provider.team = {
        teamName: `${provider.fullName}'s Vaadeeka Brundam`,
        description: 'Vedic ritual team',
        memberIds: [],
      };
    }

    if (!provider.team.memberIds) provider.team.memberIds = [];

    if (!provider.team.memberIds.includes(memberProviderId)) {
      provider.team.memberIds.push(memberProviderId);

      // Notify the added vaadyar
      this.dataStore.notifications.unshift({
        _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        userId: memberProvider.userId,
        channel: 'IN_APP',
        category: 'SERVICE_ASSIGNMENT',
        title: `Added to Vaadyar Team: ${provider.team.teamName}`,
        message: `${provider.fullName} added you as a member of their Vaadeeka team. You can now receive work assignments directly from them.`,
        status: 'DELIVERED',
        isRead: false,
        createdAt: new Date(),
      });
    }

    return this.getProviderTeam(userId);
  }

  async removeTeamMember(userId: string, memberProviderId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    if (provider.team?.memberIds) {
      provider.team.memberIds = provider.team.memberIds.filter((id: string) => id !== memberProviderId);
    }

    return this.getProviderTeam(userId);
  }

  // 5. Assign Work to Team Member
  async assignWorkToTeamMember(
    userId: string,
    eventId: string,
    data: {
      memberProviderId: string;
      roleInEvent: 'PUROHITH' | 'SWAMIGAL_1' | 'SWAMIGAL_2' | 'COOK';
      grossRemuneration?: number;
      instructions?: string;
    },
  ) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

    const event = this.dataStore.events.find((e) => e._id === eventId);
    if (!event) throw new NotFoundException('Event / Work not found');

    const memberProvider = this.dataStore.providers.find((p) => p._id === data.memberProviderId);
    if (!memberProvider) throw new NotFoundException('Team member not found');

    if (!event.assignedTeam) event.assignedTeam = {};

    // Map role to assignedTeam slots
    if (data.roleInEvent === 'PUROHITH') event.assignedTeam.purohithId = memberProvider._id;
    if (data.roleInEvent === 'SWAMIGAL_1') event.assignedTeam.swamigal1Id = memberProvider._id;
    if (data.roleInEvent === 'SWAMIGAL_2') event.assignedTeam.swamigal2Id = memberProvider._id;
    if (data.roleInEvent === 'COOK') event.assignedTeam.cookId = memberProvider._id;

    // Check or remove existing assignment for that role in this event
    const existingIdx = this.dataStore.assignments.findIndex(
      (a) => a.eventId === eventId && a.roleInEvent === data.roleInEvent,
    );
    if (existingIdx !== -1) {
      this.dataStore.assignments.splice(existingIdx, 1);
    }

    const remuneration = Number(data.grossRemuneration) || (data.roleInEvent === 'COOK' ? 3000 : 2500);

    const newAssignment = {
      _id: `asg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      providerId: memberProvider._id,
      roleInEvent: data.roleInEvent,
      status: AssignmentStatus.ASSIGNED,
      grossRemuneration: remuneration,
      assignedAt: new Date(),
      assignedByProviderId: provider._id,
      assignedByProviderName: provider.fullName,
      instructions: data.instructions || '',
    };

    this.dataStore.assignments.unshift(newAssignment);

    // Send high-priority notification to the assigned member
    const dateStr = event.scheduledDate ? new Date(event.scheduledDate).toLocaleDateString() : 'Upcoming Date';
    this.dataStore.notifications.unshift({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: memberProvider.userId,
      channel: 'IN_APP',
      category: 'SERVICE_ASSIGNMENT',
      title: `New Assignment from ${provider.fullName}`,
      message: `You have been assigned as ${data.roleInEvent} for "${event.title}" on ${dateStr}. Dakshina: ₹${remuneration.toLocaleString('en-IN')}. ${data.instructions ? `Notes: "${data.instructions}"` : ''}`,
      status: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    return {
      success: true,
      event,
      assignment: newAssignment,
    };
  }
}
