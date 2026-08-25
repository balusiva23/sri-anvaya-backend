import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { FamiliesModule } from './modules/families/families.module';
import { PitruModule } from './modules/pitru/pitru.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { EventsModule } from './modules/events/events.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CustomersModule,
    FamiliesModule,
    PitruModule,
    PlansModule,
    SubscriptionsModule,
    PaymentsModule,
    EventsModule,
    ProvidersModule,
    AssignmentsModule,
    WalletModule,
    NotificationsModule,
    AdminModule,
    SettingsModule,
    UploadsModule,
    AuditModule,
  ],
})
export class AppModule {}
