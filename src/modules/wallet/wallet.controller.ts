<<<<<<< HEAD
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
=======
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../schemas/user.schema';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

<<<<<<< HEAD
  // 1. Provider Wallet Summary, Ledger & Claims
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  @Get('me')
  getMyWallet(@CurrentUser() user: any) {
    return this.walletService.getMyWallet(user.userId);
  }

<<<<<<< HEAD
  // 2. Provider Applies for Welfare Claim
  @Post('claim')
  applyClaim(@CurrentUser() user: any, @Body() body: any) {
    return this.walletService.applyClaim(user.userId, body);
  }

  // 3. Provider My Claims History
  @Get('claims/my')
  getMyClaims(@CurrentUser() user: any) {
    return this.walletService.getMyClaims(user.userId);
  }

  // 4. Provider Cancels a Pending Claim
  @Delete('claims/:id')
  cancelClaim(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walletService.cancelClaim(user.userId, id);
  }

  // 5. Admin Lists All Provider Welfare Claims
  @Get('admin/claims')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.OPERATIONS)
  getAdminClaims(
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.walletService.getAdminClaims(status, category);
  }

  // 6. Admin Reviews Claim (Approve / Reject)
  @Put('admin/claims/:id/review')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.OPERATIONS)
  reviewClaim(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { action: 'APPROVE' | 'REJECT'; adminNotes?: string },
  ) {
    return this.walletService.reviewClaim(
      id,
      user.fullName || 'Sri Anvaya Admin',
      body.action,
      body.adminNotes,
    );
  }

  // 7. Admin Disburses Approved Claim
  @Post('admin/claims/:id/disburse')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
  disburseClaim(@CurrentUser() user: any, @Param('id') id: string) {
    return this.walletService.disburseClaim(id, user.fullName || 'Sri Anvaya Admin');
  }

  // 8. Admin Welfare Reconciliation
  @Get('admin/reconciliation')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE, UserRole.OPERATIONS)
=======
  @Get('admin/reconciliation')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  getAdminReconciliation() {
    return this.walletService.getAdminReconciliation();
  }

<<<<<<< HEAD
  // 9. Admin Month-End Batch Consolidation
=======
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  @Post('admin/consolidate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.FINANCE)
  consolidateMonthEnd(@Body('providerId') providerId?: string) {
    return this.walletService.consolidateMonthEnd(providerId);
  }
}
