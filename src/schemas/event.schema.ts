import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  PLANNING = 'PLANNING',
  UPCOMING = 'UPCOMING',
  CONFIRMATION_REQUIRED = 'CONFIRMATION_REQUIRED',
  PROVIDER_ASSIGNMENT = 'PROVIDER_ASSIGNMENT',
  READY = 'READY',
  EVENT_DAY = 'EVENT_DAY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PitruRecord', required: true })
  pitruRecordId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Plan' })
  planId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ type: String, enum: EventStatus, default: EventStatus.PLANNING })
  status: EventStatus;

  @Prop({ type: Object })
  location: {
    venueType?: string; // 'HOME' | 'MANDAPAM' | 'SPECIFIED_LOCATION'
    address?: string;
    city?: string;
    pincode?: string;
    notes?: string;
  };

  @Prop({ type: Object, default: {} })
  assignedTeam: {
    purohithId?: MongooseSchema.Types.ObjectId;
    swamigal1Id?: MongooseSchema.Types.ObjectId;
    swamigal2Id?: MongooseSchema.Types.ObjectId;
    cookId?: MongooseSchema.Types.ObjectId;
  };

  @Prop({ type: Array, default: [] })
  checklist: Array<{
    item: string;
    isCompleted: boolean;
    completedAt?: Date;
    completedBy?: string;
  }>;

  @Prop()
  samagriKitProvided?: boolean;

  @Prop()
  notes?: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  adminVerified?: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ customerId: 1 });
EventSchema.index({ scheduledDate: 1 });
EventSchema.index({ status: 1 });
