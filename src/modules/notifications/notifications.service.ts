import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { NotificationChannel } from '../../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMyNotifications(userId: string) {
<<<<<<< HEAD
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (provider) {
      // Find upcoming works in the next 7 days for this provider
      const now = new Date();
      const next7Days = new Date(now.getTime() + 7 * 86400000);
      const myAssignments = this.dataStore.assignments.filter((a) => a.providerId === provider._id);

      for (const asg of myAssignments) {
        const event = this.dataStore.events.find((e) => e._id === asg.eventId);
        if (event && event.scheduledDate) {
          const evtDate = new Date(event.scheduledDate);
          if (evtDate >= now && evtDate <= next7Days) {
            const notifKey = `upcoming_${event._id}_${provider._id}`;
            const existing = (this.dataStore.notifications as any[]).find((n) => n.key === notifKey);
            if (!existing) {
              const diffHours = Math.round((evtDate.getTime() - now.getTime()) / (1000 * 60 * 60));
              const timeLabel = diffHours <= 24 ? 'tomorrow' : `in ${Math.round(diffHours / 24)} days`;
              this.dataStore.notifications.unshift({
                _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                key: notifKey,
                userId: userId,
                channel: NotificationChannel.IN_APP,
                category: 'SERVICE_ASSIGNMENT',
                title: `Upcoming Work Reminder: ${event.title}`,
                message: `You have a sacred assignment scheduled ${timeLabel} on ${evtDate.toLocaleDateString()} at ${event.location?.address || 'Customer Location'}. Role: ${asg.roleInEvent}.`,
                status: 'DELIVERED',
                isRead: false,
                createdAt: new Date(),
              } as any);
            }
          }
        }
      }
    }
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
    return this.dataStore.notifications.filter((n) => n.userId === userId || !n.userId);
  }

  async markAsRead(id: string) {
    const notif = this.dataStore.notifications.find((n) => n._id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  }

<<<<<<< HEAD
  async markAllAsRead(userId: string) {
    this.dataStore.notifications.forEach((n) => {
      if (n.userId === userId || !n.userId) {
        n.isRead = true;
      }
    });
    return { success: true };
  }

=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  async sendNotification(data: {
    userId?: string;
    channel: NotificationChannel;
    title: string;
    message: string;
    recipientAddress?: string;
  }) {
    const newNotif = {
      _id: `notif_${Date.now()}`,
      userId: data.userId,
      channel: data.channel,
      title: data.title,
      message: data.message,
      recipientAddress: data.recipientAddress,
      status: 'SENT',
      isRead: false,
      createdAt: new Date(),
    };
    this.dataStore.notifications.push(newNotif);
    return newNotif;
  }

  async getAllCommunications() {
    return this.dataStore.notifications.map((n) => {
      const user = n.userId ? this.dataStore.users.find((u) => u._id === n.userId) : null;
      return {
        ...n,
        recipientName: user?.fullName,
        recipientEmail: user?.email,
      };
    });
  }
}
