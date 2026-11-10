import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { NotificationChannel } from '../../schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMyNotifications(userId: string) {
    return this.dataStore.notifications.filter((n) => n.userId === userId || !n.userId);
  }

  async markAsRead(id: string) {
    const notif = this.dataStore.notifications.find((n) => n._id === id);
    if (notif) notif.isRead = true;
    return { success: true };
  }

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
