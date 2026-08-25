import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class FamiliesService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getFamily(userId: string) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer profile not found');
    let family = this.dataStore.families.find((f) => f.customerId === customer._id);
    if (!family) {
      family = {
        _id: `fam_${Date.now()}`,
        customerId: customer._id,
        gothram: '',
        kuladeivam: '',
        nativePlace: '',
        members: [{ id: 'm_self', fullName: customer.fullName, relationship: 'Self / Kartha', phone: customer.phone }],
        createdAt: new Date(),
      };
      this.dataStore.families.push(family);
    }
    return family;
  }

  async updateFamily(userId: string, data: any) {
    const customer = this.dataStore.customers.find((c) => c.userId === userId);
    if (!customer) throw new NotFoundException('Customer profile not found');
    let family = this.dataStore.families.find((f) => f.customerId === customer._id);
    if (!family) {
      family = {
        _id: `fam_${Date.now()}`,
        customerId: customer._id,
        ...data,
        createdAt: new Date(),
      };
      this.dataStore.families.push(family);
    } else {
      Object.assign(family, data);
    }
    return family;
  }

  async addMember(userId: string, member: any) {
    const family = await this.getFamily(userId);
    const newMember = {
      id: `m_${Date.now()}`,
      fullName: member.fullName,
      relationship: member.relationship,
      phone: member.phone || '',
      notes: member.notes || '',
    };
    family.members.push(newMember);
    return family;
  }

  async removeMember(userId: string, memberId: string) {
    const family = await this.getFamily(userId);
    family.members = family.members.filter((m: any) => m.id !== memberId);
    return family;
  }
}
