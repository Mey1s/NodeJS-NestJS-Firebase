import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from '@google-cloud/firestore';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const rewardsCollectionName = 'rewards';

export class RewardMethods {
    static createInitialReward = async (reward: CreateRewardDtoRequest) => {
        return {
            uid: uuidv4(),
            name: reward.name,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateRewardDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 250)
    @ApiProperty()
    name: string;
}

export class FindRewardDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;

    @ApiProperty()
    updatedDate: Timestamp;

    constructor(reward: FindRewardDtoResponse) {
        this.uid = reward.uid;
        this.name = reward.name;
        this.isDeleted = reward.isDeleted;
        this.createdDate = reward.createdDate;
        this.updatedDate = reward.updatedDate;
    }
}

export class UpdateRewardDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 250)
    @ApiProperty()
    name?: string;
}