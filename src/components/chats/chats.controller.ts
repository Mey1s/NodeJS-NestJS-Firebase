import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateChatDtoRequest, FindChatDtoResponse, UpdateChatDtoRequest } from './chats.document';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.chatsService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateChat: UpdateChatDtoRequest): Promise<FindChatDtoResponse> {
    return await this.chatsService.updateOne(uid, updateChat);
  }

  @Get('/one')
  async findOne(@Body('isParticipansOrMessages') isParticipansOrMessages: string,
  @Body('participansOrMessagesValue') participansOrMessagesValue: string[]): Promise<FindChatDtoResponse> {
    return await this.chatsService.findOne(isParticipansOrMessages, participansOrMessagesValue);
  }

  @Get()
  async findAll(@Body('chatFields') chatFields: Partial<FindChatDtoResponse>[] = []): Promise<FindChatDtoResponse[]> {
    return await this.chatsService.findAll(chatFields);
  }

  @Post()
  async create(@Body() chat: CreateChatDtoRequest): Promise<FindChatDtoResponse> {
    return await this.chatsService.create(chat);
  }
}
