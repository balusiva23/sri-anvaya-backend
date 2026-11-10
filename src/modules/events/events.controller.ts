import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';
import { EventStatus } from '../../schemas/event.schema';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('my')
  getMyEvents(@CurrentUser() user: any) {
    return this.eventsService.getMyEvents(user.userId);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS)
  getAllEvents() {
    return this.eventsService.getAllEvents();
  }

  @Get(':id')
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS)
  updateStatus(@Param('id') id: string, @Body('status') status: EventStatus) {
    return this.eventsService.updateEventStatus(id, status);
  }

  @Put(':id/checklist')
  updateChecklist(
    @Param('id') id: string,
    @Body() body: { itemIndex: number; isCompleted: boolean },
  ) {
    return this.eventsService.updateChecklist(id, body.itemIndex, body.isCompleted);
  }
}
