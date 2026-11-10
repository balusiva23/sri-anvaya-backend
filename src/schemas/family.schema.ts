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
  fatherGothram?: string;

  @Prop()
  motherGothram?: string;

  @Prop({ type: Object, default: {} })
  pitruChart?: {
    fatherGothram?: string;
    motherGothram?: string;
    father?: string;
    paternalGrandfather?: string;
    paternalGreatGrandfather?: string;
    mother?: string;
    paternalGrandmother?: string;
    paternalGreatGrandmother?: string;
    paternalGGreatGrandmother?: string;
    maternalGrandfather?: string;
    maternalGreatGrandfather?: string;
    maternalGGreatGrandfather?: string;
    maternalGrandmother?: string;
    maternalGreatGrandmother?: string;
    maternalGGreatGrandmother?: string;
    maternalGGGreatGrandmother?: string;
  };

  @Prop()
  acharyan?: string;

  @Prop()
  vedham?: string;

  @Prop()
  suthram?: string;

  @Prop()
  kuladeivam?: string;

  @Prop()
  nativePlace?: string;

  @Prop({ type: Object, default: {} })
  fatherTharpanam?: {
    masa?: string;
    paksham?: string;
    tithi?: string;
  };

  @Prop({ type: Object, default: {} })
  motherTharpanam?: {
    masa?: string;
    paksham?: string;
    tithi?: string;
  };

  @Prop({ type: Array, default: [] })
  fatherLineage?: Array<{
    relationship: string;
    name: string;
    spouseName?: string;
    notes?: string;
  }>;

  @Prop({ type: Array, default: [] })
  motherLineage?: Array<{
    relationship: string;
    name: string;
    spouseName?: string;
    notes?: string;
  }>;

  @Prop({ type: Array, default: [] })
  maternalGrandmotherLineage?: Array<{
    relationship: string;
    name: string;
    spouseName?: string;
    notes?: string;
  }>;

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
