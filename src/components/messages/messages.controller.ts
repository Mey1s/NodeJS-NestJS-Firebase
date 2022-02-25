import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDtoRequest, FindMessageDtoResponse } from './messages.document';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.messagesService.deleteOne(uid);
  }

  @Get(':uid')
  async findOne(@Param('uid') search: string): Promise<FindMessageDtoResponse> {
    return await this.messagesService.findOne(search);
  }

  @Get()
  async findAll(@Body('messagesFields') messagesFields: Partial<FindMessageDtoResponse>[] = []): Promise<FindMessageDtoResponse[]> {
    return await this.messagesService.findAll(messagesFields);
  }

  @Post()
  async createOne(@Body() message: CreateMessageDtoRequest): Promise<FindMessageDtoResponse> {
    return await this.messagesService.create(message);
  }
}
