import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PitruRecordDocument = PitruRecord & Document;

@Schema({ timestamps: true })
export class PitruRecord {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  pitruName: string;

  @Prop({ required: true })
  relationship: string;

  @Prop()
  karthaName?: string;

  @Prop({ default: 'Chandramana' })
  calendarType: string; // Chandramana, Solar, Gregorian

  @Prop()
  masa?: string;

  @Prop()
  paksha?: string; // Shukla / Krishna

  @Prop()
  tithi?: string;

  @Prop()
  nakshatra?: string;

  @Prop()
  englishDate?: Date;

  @Prop()
  annualDateNotes?: string;

  @Prop()
  notes?: string;

  @Prop({ type: [String], default: [] })
  documentUrls: string[];
}

export const PitruRecordSchema = SchemaFactory.createForClass(PitruRecord);
PitruRecordSchema.index({ customerId: 1 });
