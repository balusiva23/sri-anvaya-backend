import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { RazorpayProvider } from './razorpay.provider';
import { StripeProvider } from './stripe.provider';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayProvider, StripeProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
