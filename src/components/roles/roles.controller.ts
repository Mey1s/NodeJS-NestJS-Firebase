import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRoleDtoRequest, FindRoleDtoResponse, UpdateRoleDtoRequest } from './roles.document';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.rolesService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateReward: UpdateRoleDtoRequest): Promise<FindRoleDtoResponse> {
    return await this.rolesService.updateOne(uid, updateReward);
  }

  @Get(':uid')
  async getOne(@Param('uid') uid: string): Promise<FindRoleDtoResponse> {
    return await this.rolesService.findOne(uid);
  }

  @Get()
  async getAll(@Body('rolesFields') rolesFields: Partial<FindRoleDtoResponse>[] = []): Promise<FindRoleDtoResponse[]> {
    return await this.rolesService.findAll(rolesFields);
  }

  @Post()
  async create(@Body() role: CreateRoleDtoRequest): Promise<FindRoleDtoResponse> {
    return await this.rolesService.create(role);
  }
}
