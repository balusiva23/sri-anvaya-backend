<<<<<<< HEAD
import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
=======
import { Controller, Get, Put, Body, Query, UseGuards } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
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

<<<<<<< HEAD
  @Put('profile')
  updateProviderProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.providersService.updateProviderProfile(user.userId, body);
  }

=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  @Put('availability')
  updateAvailability(
    @CurrentUser() user: any,
    @Body() body: { isAvailable: boolean; unavailableDates?: string[] },
  ) {
    return this.providersService.updateAvailability(user.userId, body.isAvailable, body.unavailableDates);
  }
<<<<<<< HEAD

  // 1. Provider Books His Own Work
  @Post('works/book')
  bookOwnWork(@CurrentUser() user: any, @Body() body: any) {
    return this.providersService.bookOwnWork(user.userId, body);
  }

  // 2. Provider Calendar (Works, Assignments & Daily Notes)
  @Get('calendar')
  getProviderCalendar(@CurrentUser() user: any) {
    return this.providersService.getProviderCalendar(user.userId);
  }

  @Post('calendar/notes')
  saveCalendarNote(
    @CurrentUser() user: any,
    @Body() body: { date: string; note: string },
  ) {
    return this.providersService.saveCalendarNote(user.userId, body.date, body.note);
  }

  // 4. Provider Team Management
  @Get('team')
  getProviderTeam(@CurrentUser() user: any) {
    return this.providersService.getProviderTeam(user.userId);
  }

  @Post('team')
  updateProviderTeam(
    @CurrentUser() user: any,
    @Body() body: { teamName: string; description?: string },
  ) {
    return this.providersService.updateProviderTeam(user.userId, body);
  }

  @Post('team/members')
  addTeamMember(
    @CurrentUser() user: any,
    @Body() body: { memberProviderId: string },
  ) {
    return this.providersService.addTeamMember(user.userId, body.memberProviderId);
  }

  @Delete('team/members/:memberId')
  removeTeamMember(
    @CurrentUser() user: any,
    @Param('memberId') memberId: string,
  ) {
    return this.providersService.removeTeamMember(user.userId, memberId);
  }

  // 5. Assign Work to Team Member
  @Post('works/:id/assign')
  assignWorkToTeamMember(
    @CurrentUser() user: any,
    @Param('id') eventId: string,
    @Body() body: {
      memberProviderId: string;
      roleInEvent: 'PUROHITH' | 'SWAMIGAL_1' | 'SWAMIGAL_2' | 'COOK';
      grossRemuneration?: number;
      instructions?: string;
    },
  ) {
    return this.providersService.assignWorkToTeamMember(user.userId, eventId, body);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.providersService.updateProviderStatus(id, body.status, body.notes);
  }
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
}
