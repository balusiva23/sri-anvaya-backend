import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { WalletTxType } from '../../schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(private readonly dataStore: DataStoreService) {}

  async getMyWallet(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider not found');

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

    const transactions = this.dataStore.walletTransactions.filter((t) => t.providerId === provider._id);
    const earnings = this.dataStore.earnings.filter((e) => e.providerId === provider._id);

    return {
      wallet,
      provider,
      transactions,
      earnings,
    };
  }

  async getAdminReconciliation() {
    const totalAllocated = this.dataStore.wallets.reduce((acc, w) => acc + (w.lifetimeAllocated || 0), 0);
    const totalCurrentBalance = this.dataStore.wallets.reduce((acc, w) => acc + (w.currentBalance || 0), 0);
    const totalDisbursed = this.dataStore.wallets.reduce((acc, w) => acc + (w.lifetimeDisbursed || 0), 0);

    const providerWallets = this.dataStore.wallets.map((w) => {
      const provider = this.dataStore.providers.find((p) => p._id === w.providerId);
      const user = provider ? this.dataStore.users.find((u) => u._id === provider.userId) : null;
      return {
        ...w,
        provider: { ...provider, email: user?.email },
      };
    });

    return {
      summary: {
        totalAllocated,
        totalCurrentBalance,
        totalDisbursed,
        activeProvidersWithWallets: this.dataStore.wallets.length,
      },
      providerWallets,
      recentTransactions: this.dataStore.walletTransactions.slice(-20).reverse(),
    };
  }

  async consolidateMonthEnd(providerId?: string) {
    const walletsToProcess = providerId
      ? this.dataStore.wallets.filter((w) => w.providerId === providerId)
      : this.dataStore.wallets.filter((w) => w.currentBalance > 0);

    const processed = [];

    for (const wallet of walletsToProcess) {
      const balance = wallet.currentBalance;
      if (balance <= 0) continue;

      wallet.currentBalance = 0;
      wallet.lifetimeDisbursed = (wallet.lifetimeDisbursed || 0) + balance;
      wallet.lastConsolidatedAt = new Date();

      const tx = {
        _id: `wtx_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        walletId: wallet._id,
        providerId: wallet.providerId,
        amount: balance,
        type: WalletTxType.MONTH_END_PROTECTION_DISBURSEMENT,
        description: `Month-End Welfare Protection & Insurance Premium Disbursement (₹${balance})`,
        status: 'COMPLETED',
        createdAt: new Date(),
      };
      this.dataStore.walletTransactions.push(tx);
      processed.push({ walletId: wallet._id, providerId: wallet.providerId, amountDisbursed: balance });
    }

    return {
      success: true,
      processedCount: processed.length,
      processed,
    };
  }
}
