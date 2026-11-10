import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATIONS = 'OPERATIONS',
  FINANCE = 'FINANCE',
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  PROVIDER_MANAGER = 'PROVIDER_MANAGER',
  PROVIDER = 'PROVIDER',
  CUSTOMER = 'CUSTOMER',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.CUSTOMER] })
  roles: UserRole[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatarUrl?: string;

  @Prop()
  lastLoginAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
