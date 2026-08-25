import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // 1. Public Dynamic Contact Info Endpoint
  @Get('contact-info')
  getContactInfo() {
    return this.settingsService.getContactInfo();
  }

  // 2. Admin Protected Update Contact Info Endpoint
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Put('contact-info')
  updateContactInfo(@Body() body: any) {
    return this.settingsService.updateContactInfo(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getAllSettings() {
    return this.settingsService.getAllSettings();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateSetting(@Body() body: { key: string; value: any }) {
    return this.settingsService.updateSetting(body.key, body.value);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('infra-status')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATIONS, UserRole.FINANCE)
  getInfraStatus() {
    return this.settingsService.getInfraStatus();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('infra-config')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getInfraConfig() {
    return this.settingsService.getInfraConfig();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('infra-config/:service')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  updateInfraConfig(@Param('service') service: string, @Body() body: any) {
    return this.settingsService.updateInfraConfig(service, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('test-connection/:service')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  testConnection(@Param('service') service: string) {
    return this.settingsService.testConnection(service);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('backup/export')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  exportDatabase() {
    return this.settingsService.exportDatabaseSnapshot();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('backup/import')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  importDatabase(@Body() body: { snapshot: any; mode?: 'MERGE' | 'OVERWRITE' }) {
    return this.settingsService.importDatabaseSnapshot(body.snapshot, body.mode || 'OVERWRITE');
  }
}
