import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('enquiries')
export class PublicEnquiriesController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  submitEnquiry(
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      message: string;
      category?: string;
      planInterest?: string;
    },
  ) {
    return this.adminService.createEnquiry(body);
  }
}

