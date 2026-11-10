import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('my')
  getMyAssignments(@CurrentUser() user: any) {
    return this.assignmentsService.getMyAssignments(user.userId);
  }

  @Post('assign-team')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS)
  assignTeam(
    @Body() body: {
      eventId: string;
      team: {
        purohithId: string;
        swamigal1Id: string;
        swamigal2Id: string;
        cookId: string;
      };
    },
  ) {
    return this.assignmentsService.assignTeam(body.eventId, body.team);
  }

  @Post(':id/respond')
  respondToAssignment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { status: 'ACCEPTED' | 'REJECTED'; reason?: string },
  ) {
    return this.assignmentsService.respondToAssignment(user.userId, id, body.status, body.reason);
  }

  @Post(':id/arrive')
  markArrived(@CurrentUser() user: any, @Param('id') id: string) {
    return this.assignmentsService.markArrived(user.userId, id);
  }

  @Post(':id/complete')
  completeService(@CurrentUser() user: any, @Param('id') id: string) {
    return this.assignmentsService.completeService(user.userId, id);
  }
}
