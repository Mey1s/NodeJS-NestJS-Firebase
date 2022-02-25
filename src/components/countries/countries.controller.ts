import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateCountryDtoRequest, FindCountryDtoResponse } from './countries.document';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) { }

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.countriesService.deleteOne(uid);
  }

  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<FindCountryDtoResponse> {
    return await this.countriesService.findOne(uid);
  }

  @Get()
  async findAll(@Body('countriesFields') countriesFields: Partial<FindCountryDtoResponse>[] = []): Promise<FindCountryDtoResponse[]> {
    return await this.countriesService.findAll(countriesFields);
  }

  @Post()
  async createOne(@Body() country: CreateCountryDtoRequest): Promise<FindCountryDtoResponse> {
    return await this.countriesService.create(country);
  }
}
