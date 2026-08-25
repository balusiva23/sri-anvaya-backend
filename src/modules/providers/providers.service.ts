import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { ProviderRole } from '../../schemas/provider.schema';

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
    const wallet = this.dataStore.wallets.find((w) => w.providerId === provider._id);
    const earnings = this.dataStore.earnings.filter((e) => e.providerId === provider._id);
    const assignments = this.dataStore.assignments.filter((a) => a.providerId === provider._id);

    return {
      provider,
      wallet,
      earnings,
      assignments,
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
}
