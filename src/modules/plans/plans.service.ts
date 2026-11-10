import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';

@Injectable()
export class PlansService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getAllPlans() {
    return this.dataStore.plans;
  }

  async getActivePlans() {
    return this.dataStore.plans.filter((p) => p.isActive);
  }

  async getPlanById(id: string) {
    const plan = this.dataStore.plans.find((p) => p._id === id || p.code === id);
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async createPlan(data: any) {
    const planId = `plan_${Date.now()}`;
    const newPlan = {
      _id: planId,
      code: (data.code || data.name.toUpperCase().replace(/\s+/g, '_')).trim(),
      name: data.name,
      monthlyPrice: Number(data.monthlyPrice) || 0,
      annualValue: Number(data.annualValue) || (Number(data.monthlyPrice) * 12) || 0,
      description: data.description || '',
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      isRecommended: Boolean(data.isRecommended),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      createdAt: new Date(),
    };
    this.dataStore.plans.push(newPlan);
    return newPlan;
  }

  async updatePlan(id: string, data: any) {
    const plan = this.dataStore.plans.find((p) => p._id === id || p.code === id);
    if (!plan) throw new NotFoundException('Plan not found');

    if (data.name !== undefined) plan.name = data.name;
    if (data.code !== undefined) plan.code = data.code;
    if (data.monthlyPrice !== undefined) plan.monthlyPrice = Number(data.monthlyPrice);
    if (data.annualValue !== undefined) plan.annualValue = Number(data.annualValue);
    if (data.description !== undefined) plan.description = data.description;
    if (data.inclusions !== undefined) plan.inclusions = Array.isArray(data.inclusions) ? data.inclusions : [];
    if (data.isRecommended !== undefined) plan.isRecommended = Boolean(data.isRecommended);
    if (data.isActive !== undefined) plan.isActive = Boolean(data.isActive);

    return plan;
  }

  async deletePlan(id: string) {
    const index = this.dataStore.plans.findIndex((p) => p._id === id || p.code === id);
    if (index === -1) throw new NotFoundException('Plan not found');

    const deleted = this.dataStore.plans.splice(index, 1)[0];
    return {
      success: true,
      message: `Plan '${deleted.name}' deleted successfully.`,
      deletedId: id,
    };
  }
}
