import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/feedback')
  async getFeedbacks(@Query('offset') offset?: number, @Query('limit') limit?: number) {
    return this.appService.getFeedbacks(offset, limit);
  }

  @Get('/feedback/:uuid')
  async getFeedback(@Param('uuid') uuid: string) {
    return this.appService.getFeedback(uuid);
  }
}
