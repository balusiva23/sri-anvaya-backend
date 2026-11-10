import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProviderAssignmentDocument = ProviderAssignment & Document;

export enum AssignmentStatus {
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class ProviderAssignment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true })
  providerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  roleInEvent: string; // 'PUROHITH' | 'SWAMIGAL_1' | 'SWAMIGAL_2' | 'COOK'

  @Prop({ type: String, enum: AssignmentStatus, default: AssignmentStatus.ASSIGNED })
  status: AssignmentStatus;

  @Prop({ default: Date.now })
  assignedAt: Date;

  @Prop()
  respondedAt?: Date;

  @Prop()
  arrivedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 3000 })
  grossRemuneration: number;

  @Prop()
  rejectionReason?: string;
}

export const ProviderAssignmentSchema = SchemaFactory.createForClass(ProviderAssignment);
ProviderAssignmentSchema.index({ eventId: 1 });
ProviderAssignmentSchema.index({ providerId: 1 });
ProviderAssignmentSchema.index({ status: 1 });
