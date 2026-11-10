import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PublicEnquiriesController } from './public-enquiries.controller';

@Module({
  controllers: [AdminController, PublicEnquiriesController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
