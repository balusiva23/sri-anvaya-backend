import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FamilyDocument = Family & Document;

@Schema({ timestamps: true })
export class Family {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true, unique: true })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop()
  gothram?: string;

  @Prop()
  kuladeivam?: string;

  @Prop()
  nativePlace?: string;

  @Prop({ type: Array, default: [] })
  members: Array<{
    id: string;
    fullName: string;
    relationship: string;
    phone?: string;
    notes?: string;
  }>;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
FamilySchema.index({ customerId: 1 });
