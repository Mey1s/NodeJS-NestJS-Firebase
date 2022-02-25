import { Controller, Get, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(){
    return 'helloo';
  }

  // @Get('/hello')
  // getHello(@Req() request: Request): string {
  //   return 'hello' + request['user']?.email;
  // }
}
