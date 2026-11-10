import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WelfareWalletDocument = WelfareWallet & Document;

@Schema({ timestamps: true })
export class WelfareWallet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true, unique: true })
  providerId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  currentBalance: number;

  @Prop({ default: 0 })
  lifetimeAllocated: number;

  @Prop({ default: 0 })
  lifetimeDisbursed: number;

  @Prop()
  lastConsolidatedAt?: Date;

  @Prop({ default: 'ACTIVE' })
  status: string;
}

export const WelfareWalletSchema = SchemaFactory.createForClass(WelfareWallet);
WelfareWalletSchema.index({ providerId: 1 });

export type WalletTransactionDocument = WalletTransaction & Document;

export enum WalletTxType {
  CREDIT_ALLOCATION = 'CREDIT_ALLOCATION',
  MONTH_END_PROTECTION_DISBURSEMENT = 'MONTH_END_PROTECTION_DISBURSEMENT',
  ADJUSTMENT = 'ADJUSTMENT',
  CLAIM_DISBURSEMENT = 'CLAIM_DISBURSEMENT',
}

export enum WelfareClaimCategory {
  HEALTH_MEDICAL = 'HEALTH_MEDICAL',
  CHILD_EDUCATION = 'CHILD_EDUCATION',
  FAMILY_EMERGENCY = 'FAMILY_EMERGENCY',
  VEDIC_STUDY_TRAVEL = 'VEDIC_STUDY_TRAVEL',
  OTHER = 'OTHER',
}

export enum WelfareClaimStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
}

export type WelfareClaimDocument = WelfareClaim & Document;

@Schema({ timestamps: true })
export class WelfareClaim {
  @Prop({ required: true, unique: true })
  claimNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  providerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  providerName: string;

  @Prop()
  providerPhone?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WelfareWallet', required: true })
  walletId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: WelfareClaimCategory, required: true })
  category: WelfareClaimCategory;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reason: string;

  @Prop()
  hospitalOrInstituteName?: string;

  @Prop({ type: Object, default: {} })
  bankDetails?: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
  };

  @Prop()
  supportingDocsNotes?: string;

  @Prop({ type: String, enum: WelfareClaimStatus, default: WelfareClaimStatus.PENDING })
  status: WelfareClaimStatus;

  @Prop()
  adminNotes?: string;

  @Prop()
  reviewedBy?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  disbursedAt?: Date;

  @Prop()
  disbursedTransactionId?: string;
}

export const WelfareClaimSchema = SchemaFactory.createForClass(WelfareClaim);
WelfareClaimSchema.index({ providerId: 1 });
WelfareClaimSchema.index({ status: 1 });

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WelfareWallet', required: true })
  walletId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  providerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  eventId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, enum: WalletTxType, required: true })
  type: WalletTxType;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'COMPLETED' })
  status: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const WalletTransactionSchema = SchemaFactory.createForClass(WalletTransaction);
WalletTransactionSchema.index({ walletId: 1 });
WalletTransactionSchema.index({ providerId: 1 });
