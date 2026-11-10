import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProviderEarningDocument = ProviderEarning & Document;

@Schema({ timestamps: true })
export class ProviderEarning {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  providerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProviderAssignment', required: true })
  assignmentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  grossAmount: number;

  @Prop({ required: true, default: 12 })
  welfarePercentage: number; // Configurable, default 12%

  @Prop({ required: true })
  welfareAmount: number; // e.g. 12% of 3000 = 360

  @Prop({ required: true })
  netDirectPayout: number; // e.g. 88% of 3000 = 2640

  @Prop({ default: 'PAID' })
  payoutStatus: string; // 'PENDING' | 'PROCESSING' | 'PAID'

  @Prop()
  payoutReference?: string;
}

export const ProviderEarningSchema = SchemaFactory.createForClass(ProviderEarning);
ProviderEarningSchema.index({ providerId: 1 });
ProviderEarningSchema.index({ eventId: 1 });
