<<<<<<< HEAD
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import {
  WalletTxType,
  WelfareClaimCategory,
  WelfareClaimStatus,
} from '../../schemas/wallet.schema';
=======
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStoreService } from '../../database/data-store.service';
import { WalletTxType } from '../../schemas/wallet.schema';
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3

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

<<<<<<< HEAD
    const transactions = this.dataStore.walletTransactions
      .filter((t) => t.providerId === provider._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const earnings = this.dataStore.earnings.filter((e) => e.providerId === provider._id);

    const claims = (this.dataStore.welfareClaims || [])
      .filter((c) => c.providerId === provider._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

=======
    const transactions = this.dataStore.walletTransactions.filter((t) => t.providerId === provider._id);
    const earnings = this.dataStore.earnings.filter((e) => e.providerId === provider._id);

>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
    return {
      wallet,
      provider,
      transactions,
      earnings,
<<<<<<< HEAD
      claims,
    };
  }

  async applyClaim(userId: string, data: any) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');

    let wallet = this.dataStore.wallets.find((w) => w.providerId === provider._id);
    if (!wallet) {
      throw new BadRequestException('Welfare wallet not initialized for your account');
    }

    const amount = Number(data.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Claim amount must be a valid positive number');
    }

    if (amount > wallet.currentBalance) {
      throw new BadRequestException(
        `Requested claim amount (₹${amount.toLocaleString('en-IN')}) exceeds your current wallet balance of ₹${wallet.currentBalance.toLocaleString('en-IN')}`,
      );
    }

    if (!data.title || !data.title.trim()) {
      throw new BadRequestException('Claim title / purpose is required');
    }

    if (!data.reason || !data.reason.trim()) {
      throw new BadRequestException('Detailed reason / description is required');
    }

    const claimNumber = `CLM-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newClaim = {
      _id: `clm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      claimNumber,
      providerId: provider._id,
      providerName: provider.fullName,
      providerPhone: provider.phone,
      walletId: wallet._id,
      category: data.category || WelfareClaimCategory.HEALTH_MEDICAL,
      title: data.title.trim(),
      amount,
      reason: data.reason.trim(),
      hospitalOrInstituteName: data.hospitalOrInstituteName?.trim() || '',
      bankDetails: {
        accountNumber: data.bankDetails?.accountNumber || provider.bankDetails?.accountNumber || '',
        ifscCode: data.bankDetails?.ifscCode || provider.bankDetails?.ifscCode || '',
        accountHolderName:
          data.bankDetails?.accountHolderName || provider.bankDetails?.accountHolderName || provider.fullName,
        upiId: data.bankDetails?.upiId || provider.bankDetails?.upiId || '',
      },
      supportingDocsNotes: data.supportingDocsNotes?.trim() || '',
      status: WelfareClaimStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!this.dataStore.welfareClaims) {
      this.dataStore.welfareClaims = [];
    }
    this.dataStore.welfareClaims.push(newClaim);

    // 1. Notification to Provider
    this.dataStore.notifications.push({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: provider.userId,
      channel: 'IN_APP',
      category: 'WELFARE_CLAIM',
      title: `Welfare Claim Submitted (${newClaim.claimNumber})`,
      message: `Your claim of ₹${amount.toLocaleString('en-IN')} for "${newClaim.title}" has been submitted for administrative review.`,
      status: 'DELIVERED',
      isRead: false,
      createdAt: new Date(),
    });

    // 2. Notification to Admins
    const adminUsers = this.dataStore.users.filter((u) =>
      u.roles?.some((r: string) => ['SUPER_ADMIN', 'ADMIN', 'OPERATIONS'].includes(r)),
    );
    for (const admin of adminUsers) {
      this.dataStore.notifications.push({
        _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        userId: admin._id,
        channel: 'IN_APP',
        category: 'WELFARE_CLAIM',
        title: `New Welfare Claim: ${newClaim.claimNumber}`,
        message: `${provider.fullName} requested ₹${amount.toLocaleString('en-IN')} for "${newClaim.title}".`,
        status: 'DELIVERED',
        isRead: false,
        createdAt: new Date(),
      });
    }

    return {
      success: true,
      claim: newClaim,
    };
  }

  async getMyClaims(userId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');

    const claims = (this.dataStore.welfareClaims || [])
      .filter((c) => c.providerId === provider._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      claims,
    };
  }

  async cancelClaim(userId: string, claimId: string) {
    const provider = this.dataStore.providers.find((p) => p.userId === userId);
    if (!provider) throw new NotFoundException('Provider profile not found');

    const claimIndex = (this.dataStore.welfareClaims || []).findIndex(
      (c) => c._id === claimId && c.providerId === provider._id,
    );
    if (claimIndex === -1) {
      throw new NotFoundException('Claim not found or unauthorized');
    }

    const claim = this.dataStore.welfareClaims[claimIndex];
    if (claim.status !== WelfareClaimStatus.PENDING) {
      throw new BadRequestException('Only claims in PENDING status can be cancelled');
    }

    this.dataStore.welfareClaims.splice(claimIndex, 1);

    return {
      success: true,
      message: 'Claim cancelled successfully',
    };
  }

  async getAdminClaims(status?: string, category?: string) {
    let claims = [...(this.dataStore.welfareClaims || [])];

    if (status && status !== 'ALL') {
      claims = claims.filter((c) => c.status === status);
    }

    if (category && category !== 'ALL') {
      claims = claims.filter((c) => c.category === category);
    }

    // Enrich claims with provider and wallet information
    const enrichedClaims = claims
      .map((c) => {
        const provider = this.dataStore.providers.find((p) => p._id === c.providerId);
        const user = provider ? this.dataStore.users.find((u) => u._id === provider.userId) : null;
        const wallet = this.dataStore.wallets.find((w) => w._id === c.walletId || w.providerId === c.providerId);
        return {
          ...c,
          provider: provider
            ? {
                ...provider,
                email: user?.email,
              }
            : null,
          wallet: wallet
            ? {
                currentBalance: wallet.currentBalance,
                lifetimeAllocated: wallet.lifetimeAllocated,
                lifetimeDisbursed: wallet.lifetimeDisbursed,
              }
            : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const all = this.dataStore.welfareClaims || [];
    const pendingClaims = all.filter((c) => c.status === WelfareClaimStatus.PENDING);
    const approvedClaims = all.filter((c) => c.status === WelfareClaimStatus.APPROVED);
    const disbursedClaims = all.filter((c) => c.status === WelfareClaimStatus.DISBURSED);
    const rejectedClaims = all.filter((c) => c.status === WelfareClaimStatus.REJECTED);

    const summary = {
      totalClaimsCount: all.length,
      totalClaimsAmount: all.reduce((sum, c) => sum + (c.amount || 0), 0),
      pendingCount: pendingClaims.length,
      pendingAmount: pendingClaims.reduce((sum, c) => sum + (c.amount || 0), 0),
      approvedCount: approvedClaims.length,
      approvedAmount: approvedClaims.reduce((sum, c) => sum + (c.amount || 0), 0),
      disbursedCount: disbursedClaims.length,
      disbursedAmount: disbursedClaims.reduce((sum, c) => sum + (c.amount || 0), 0),
      rejectedCount: rejectedClaims.length,
    };

    return {
      summary,
      claims: enrichedClaims,
    };
  }

  async reviewClaim(claimId: string, reviewerName: string, action: 'APPROVE' | 'REJECT', adminNotes?: string) {
    const claim = (this.dataStore.welfareClaims || []).find((c) => c._id === claimId);
    if (!claim) throw new NotFoundException('Welfare claim not found');

    if (claim.status === WelfareClaimStatus.DISBURSED) {
      throw new BadRequestException('Cannot modify a claim that has already been disbursed');
    }

    const provider = this.dataStore.providers.find((p) => p._id === claim.providerId);

    if (action === 'APPROVE') {
      claim.status = WelfareClaimStatus.APPROVED;
      claim.reviewedBy = reviewerName;
      claim.reviewedAt = new Date();
      claim.adminNotes = adminNotes || 'Approved by welfare operations committee.';
      claim.updatedAt = new Date();

      if (provider) {
        this.dataStore.notifications.push({
          _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          userId: provider.userId,
          channel: 'IN_APP',
          category: 'WELFARE_CLAIM',
          title: `Welfare Claim Approved (${claim.claimNumber})`,
          message: `Your welfare claim of ₹${claim.amount.toLocaleString('en-IN')} for "${claim.title}" has been APPROVED. Disbursement will be executed shortly.`,
          status: 'DELIVERED',
          isRead: false,
          createdAt: new Date(),
        });
      }
    } else {
      claim.status = WelfareClaimStatus.REJECTED;
      claim.reviewedBy = reviewerName;
      claim.reviewedAt = new Date();
      claim.adminNotes = adminNotes || 'Claim rejected after committee review.';
      claim.updatedAt = new Date();

      if (provider) {
        this.dataStore.notifications.push({
          _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          userId: provider.userId,
          channel: 'IN_APP',
          category: 'WELFARE_CLAIM',
          title: `Welfare Claim Update (${claim.claimNumber})`,
          message: `Your welfare claim for "${claim.title}" was not approved. Remarks: ${claim.adminNotes}`,
          status: 'DELIVERED',
          isRead: false,
          createdAt: new Date(),
        });
      }
    }

    return {
      success: true,
      claim,
    };
  }

  async disburseClaim(claimId: string, adminName: string) {
    const claim = (this.dataStore.welfareClaims || []).find((c) => c._id === claimId);
    if (!claim) throw new NotFoundException('Welfare claim not found');

    if (claim.status !== WelfareClaimStatus.APPROVED) {
      throw new BadRequestException(
        `Claim must be in APPROVED status before disbursement. Current status: ${claim.status}`,
      );
    }

    const wallet = this.dataStore.wallets.find(
      (w) => w._id === claim.walletId || w.providerId === claim.providerId,
    );
    if (!wallet) throw new NotFoundException('Provider welfare wallet not found');

    if (wallet.currentBalance < claim.amount) {
      throw new BadRequestException(
        `Insufficient wallet balance. Provider has ₹${wallet.currentBalance.toLocaleString('en-IN')}, but claim amount is ₹${claim.amount.toLocaleString('en-IN')}.`,
      );
    }

    // 1. Deduct wallet balance and increment disbursed
    wallet.currentBalance -= claim.amount;
    wallet.lifetimeDisbursed = (wallet.lifetimeDisbursed || 0) + claim.amount;
    wallet.lastConsolidatedAt = new Date();

    // 2. Create Transaction Ledger entry
    const tx = {
      _id: `wtx_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      walletId: wallet._id,
      providerId: claim.providerId,
      amount: claim.amount,
      type: WalletTxType.CLAIM_DISBURSEMENT,
      description: `Welfare Claim Disbursed (${claim.claimNumber} - ${claim.title}) to ${claim.bankDetails?.upiId || claim.bankDetails?.accountNumber || 'Bank'}`,
      status: 'COMPLETED',
      metadata: {
        claimId: claim._id,
        claimNumber: claim.claimNumber,
        category: claim.category,
        bankDetails: claim.bankDetails,
        disbursedBy: adminName,
      },
      createdAt: new Date(),
    };
    this.dataStore.walletTransactions.push(tx);

    // 3. Update Claim
    claim.status = WelfareClaimStatus.DISBURSED;
    claim.disbursedAt = new Date();
    claim.disbursedTransactionId = tx._id;
    claim.updatedAt = new Date();

    // 4. Send Notification to Provider
    const provider = this.dataStore.providers.find((p) => p._id === claim.providerId);
    if (provider) {
      this.dataStore.notifications.push({
        _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        userId: provider.userId,
        channel: 'IN_APP',
        category: 'WELFARE_CLAIM',
        title: `Welfare Payout Disbursed (${claim.claimNumber})`,
        message: `₹${claim.amount.toLocaleString('en-IN')} for "${claim.title}" has been successfully transferred to your registered account (${claim.bankDetails?.upiId || claim.bankDetails?.accountNumber || 'Bank'}).`,
        status: 'DELIVERED',
        isRead: false,
        createdAt: new Date(),
      });
    }

    return {
      success: true,
      claim,
      wallet,
      transaction: tx,
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
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
