<<<<<<< HEAD
import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
=======
import { Controller, Get, UseGuards } from '@nestjs/common';
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS, UserRole.FINANCE)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  getMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('reports')
  getReports() {
    return this.adminService.getReports();
  }
<<<<<<< HEAD

  @Get('enquiries')
  getEnquiries() {
    return this.adminService.getEnquiries();
  }

  @Put('enquiries/:id/status')
  updateEnquiryStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateEnquiryStatus(id, status);
  }

  @Get('operations-permissions')
  getOperationsPermissions() {
    return this.adminService.getOperationsPermissions();
  }

  @Put('operations-permissions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  updateOperationsPermissions(@Body() body: any) {
    return this.adminService.updateOperationsPermissions(body);
  }
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
}
