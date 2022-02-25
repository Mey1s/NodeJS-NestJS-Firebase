import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateGenderDtoRequest, FindGenderDtoResponse, UpdateGenderDtoRequest } from './genders.document';
import { GendersService } from './genders.service';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.gendersService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateGender: UpdateGenderDtoRequest): Promise<FindGenderDtoResponse> {
    return await this.gendersService.updateOne(uid, updateGender);
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<FindGenderDtoResponse> {
    return await this.gendersService.findOne(uid);
  }

  @Get()
  async findAll(@Body('genderFields') genderFields: Partial<FindGenderDtoResponse>[] = []): Promise<FindGenderDtoResponse[]> {
    return await this.gendersService.findAll(genderFields);
  }

  @Post()
  async create(@Body() gender: CreateGenderDtoRequest): Promise<FindGenderDtoResponse> {
    return await this.gendersService.create(gender);
  }
}
