import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  altPhone?: string;

  @Prop({ type: Object })
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };

  @Prop({ default: 1 })
  onboardingStep: number;

  @Prop({ default: false })
  isProfileComplete: boolean;

  @Prop()
  serviceCity?: string;

  @Prop({ type: [String], default: [] })
  preferences: string[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ userId: 1 });
