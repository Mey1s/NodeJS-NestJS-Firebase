import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRejectionDtoRequest, FindRejectionDtoResponse, UpdateRejectionDtoRequest } from './rejections.document';
import { RejectionsService } from './rejections.service';

@Controller('rejections')
export class RejectionsController {
  constructor(private readonly rejectionsService: RejectionsService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.rejectionsService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateRejection: UpdateRejectionDtoRequest): Promise<FindRejectionDtoResponse> {
    return await this.rejectionsService.updateOne(uid, updateRejection);
  }

  @Get(':uid')
  async getOne(@Param('uid') uid: string): Promise<FindRejectionDtoResponse> {
    return await this.rejectionsService.findOne(uid);
  }

  @Get()
  async getAll(@Body('rejectionFields') rejectionFields: Partial<FindRejectionDtoResponse>[] = []): Promise<FindRejectionDtoResponse[]> {
    return await this.rejectionsService.findAll(rejectionFields);
  }

  @Post()
  async create(@Body() rejection: CreateRejectionDtoRequest): Promise<FindRejectionDtoResponse> {
    return await this.rejectionsService.create(rejection);
  }
}
