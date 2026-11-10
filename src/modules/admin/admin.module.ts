import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
<<<<<<< HEAD
import { PublicEnquiriesController } from './public-enquiries.controller';

@Module({
  controllers: [AdminController, PublicEnquiriesController],
=======

@Module({
  controllers: [AdminController],
>>>>>>> b6426bd68cb4124d9095710630c80a0be06e23f3
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
