import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  code: string; // ESSENTIAL, STANDARD, PREMIUM

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  monthlyPrice: number; // e.g. 1000, 1500, 2000

  @Prop({ required: true })
  annualValue: number; // e.g. 12000, 18000, 24000

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  inclusions: string[];

  @Prop({ default: false })
  isRecommended: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
PlanSchema.index({ code: 1 });
