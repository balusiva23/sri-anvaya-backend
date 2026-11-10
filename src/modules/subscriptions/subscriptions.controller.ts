import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('my')
  getMySubscription(@CurrentUser() user: any) {
    return this.subscriptionsService.getMySubscription(user.userId);
  }

  @Post('subscribe')
  subscribe(@CurrentUser() user: any, @Body() body: { planCode: string; paymentMethod?: string }) {
    return this.subscriptionsService.subscribe(user.userId, body.planCode, body.paymentMethod);
  }

  @Post('cancel')
  cancel(@CurrentUser() user: any) {
    return this.subscriptionsService.cancelSubscription(user.userId);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.OPERATIONS)
  getAllSubscriptions() {
    return this.subscriptionsService.getAllSubscriptions();
  }
}
