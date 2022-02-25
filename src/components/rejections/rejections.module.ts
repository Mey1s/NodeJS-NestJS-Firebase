import { Module } from '@nestjs/common';
import { RejectionsService } from './rejections.service';
import { RejectionsController } from './rejections.controller';

@Module({
  controllers: [RejectionsController],
  providers: [RejectionsService]
})
export class RejectionsModule {}
