import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProviderDocument = Provider & Document;

export enum ProviderRole {
  PUROHITH = 'PUROHITH',
  SWAMIGAL = 'SWAMIGAL',
  COOK = 'COOK',
  SPECIALIST = 'SPECIALIST',
}

export enum ProviderVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Provider {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: String, enum: ProviderRole, required: true })
  role: ProviderRole;

  @Prop({ required: true })
  city: string;

  @Prop({ type: [String], default: [] })
  serviceLocations: string[];

  @Prop({ type: String, enum: ProviderVerificationStatus, default: ProviderVerificationStatus.VERIFIED })
  verificationStatus: ProviderVerificationStatus;

  @Prop({ default: 4.9 })
  rating: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [Date], default: [] })
  unavailableDates: Date[];

  @Prop({ default: 0 })
  completedEventsCount: number;

  @Prop({ type: Object, default: {} })
  bankDetails: {
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
  };
}

export const ProviderSchema = SchemaFactory.createForClass(Provider);
ProviderSchema.index({ userId: 1 });
ProviderSchema.index({ role: 1 });
ProviderSchema.index({ city: 1 });
