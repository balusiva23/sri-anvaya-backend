import { Injectable } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class AuditService {
  constructor(private readonly dataStore: DataStoreService) {}

  async logAction(data: {
    userId?: string;
    userEmail?: string;
    role?: string;
    action: string;
    entity: string;
    entityId?: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
  }) {
    const log = {
      _id: `aud_${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    this.dataStore.auditLogs.push(log);
    return log;
  }

  async getAllLogs() {
    return this.dataStore.auditLogs.slice(-100).reverse();
  }
}
