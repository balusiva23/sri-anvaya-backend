import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProviderRole } from '../../schemas/provider.schema';

@Controller('providers')
@UseGuards(JwtAuthGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get('all')
  getAllProviders(@Query('role') role?: ProviderRole, @Query('city') city?: string) {
    return this.providersService.getAllProviders(role, city);
  }

  @Get('profile')
  getProviderProfile(@CurrentUser() user: any) {
    return this.providersService.getProviderProfile(user.userId);
  }

  @Put('availability')
  updateAvailability(
    @CurrentUser() user: any,
    @Body() body: { isAvailable: boolean; unavailableDates?: string[] },
  ) {
    return this.providersService.updateAvailability(user.userId, body.isAvailable, body.unavailableDates);
  }
}
