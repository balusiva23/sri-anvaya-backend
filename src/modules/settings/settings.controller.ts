import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateSetting(@Body() body: { key: string; value: any }) {
    return this.settingsService.updateSetting(body.key, body.value);
  }

  @Get('infra-status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS, UserRole.FINANCE)
  getInfraStatus() {
    return this.settingsService.getInfraStatus();
  }

  @Get('infra-config')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getInfraConfig() {
    return this.settingsService.getInfraConfig();
  }

  @Put('infra-config/:service')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateInfraConfig(@Param('service') service: string, @Body() body: any) {
    return this.settingsService.updateInfraConfig(service, body);
  }

  @Post('test-connection/:service')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  testConnection(@Param('service') service: string) {
    return this.settingsService.testConnection(service);
  }

  @Get('backup/export')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  exportDatabase() {
    return this.settingsService.exportDatabaseSnapshot();
  }

  @Post('backup/import')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  importDatabase(@Body() body: { snapshot: any; mode?: 'MERGE' | 'OVERWRITE' }) {
    return this.settingsService.importDatabaseSnapshot(body.snapshot, body.mode || 'OVERWRITE');
  }
}
