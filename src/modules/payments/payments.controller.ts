import { Controller, Post, Get, Body, Headers, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  createOrder(@CurrentUser() user: any, @Body() body: { amount: number; planId?: string; eventId?: string; provider?: string }) {
    return this.paymentsService.createOrder(user.userId, body);
  }

  @Post('verify')
  verifyPayment(@Body() body: { orderId: string; paymentId: string; signature?: string; provider?: string }) {
    return this.paymentsService.verifyPayment(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getMyPayments(user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
  @Get('all')
  getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Post('razorpay/webhook')
  razorpayWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.handleWebhook('razorpay', body, signature);
  }

  @Post('stripe/webhook')
  stripeWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
    return this.paymentsService.handleWebhook('stripe', body, signature);
  }
}
