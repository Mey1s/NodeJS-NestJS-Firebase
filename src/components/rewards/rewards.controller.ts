import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateRewardDtoRequest, FindRewardDtoResponse, UpdateRewardDtoRequest } from './rewards.document';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Delete(':uid')
  async deleteOne(@Param('uid') uid: string): Promise<FirebaseFirestore.WriteResult> {
    return await this.rewardsService.deleteOne(uid);
  }

  @Put(':uid')
  async updateOne(@Param('uid') uid: string, @Body() updateReward: UpdateRewardDtoRequest): Promise<FindRewardDtoResponse> {
    return await this.rewardsService.updateOne(uid, updateReward);
  }

  @Get(':uid')
  async getOne(@Param('uid') uid: string): Promise<FindRewardDtoResponse> {
    return await this.rewardsService.findOne(uid);
  }

  @Get()
  async getAll(@Body('rewardFields') rewardFields: Partial<FindRewardDtoResponse>[] = []): Promise<FindRewardDtoResponse[]> {
    return await this.rewardsService.findAll(rewardFields);
  }

  @Post()
  async create(@Body() reward: CreateRewardDtoRequest): Promise<FindRewardDtoResponse> {
    return await this.rewardsService.create(reward);
  }
}