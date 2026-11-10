import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, unique: true })
  paymentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subscription' })
  subscriptionId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event' })
  eventId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 'razorpay' })
  provider: string; // razorpay | stripe

  @Prop()
  providerPaymentId?: string;

  @Prop()
  providerOrderId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ default: 'card' })
  paymentMethod: string;

  @Prop()
  receiptUrl?: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ customerId: 1 });
PaymentSchema.index({ paymentId: 1 });
PaymentSchema.index({ status: 1 });
