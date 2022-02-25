import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateQuestionDtoRequest, FindQuestionDtoResponse, UpdateQuestionDtoRequest } from './questions.document';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.questionsService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateQuestion: UpdateQuestionDtoRequest): Promise<FindQuestionDtoResponse> {
    return await this.questionsService.updateOne(uid, updateQuestion);
  }

  @Get(':uid')
  async getOne(@Param('uid') uid: string): Promise<FindQuestionDtoResponse> {
    return await this.questionsService.findOne(uid);
  }

  @Get()
  async getAll(@Body('questionFields') questionFields: Partial<FindQuestionDtoResponse>[] = []): Promise<FindQuestionDtoResponse[]> {
    return await this.questionsService.findAll(questionFields);
  }

  @Post()
  async create(@Body() question: CreateQuestionDtoRequest): Promise<FindQuestionDtoResponse> {
    return await this.questionsService.create(question);
  }
}
