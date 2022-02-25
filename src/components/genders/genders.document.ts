import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const gendersCollectionName = 'genders';

export class GenderMethods {
    static createInitialGender = async (gender: CreateGenderDtoRequest) => {
        return {
            uid: uuidv4(),
            name: gender.name,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateGenderDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 50)  
    @ApiProperty()
    name: string;
}

export class FindGenderDtoResponse {
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

    constructor(gender: FindGenderDtoResponse) {
        this.uid = gender.uid;
        this.name = gender.name;
        this.isDeleted = gender.isDeleted;
        this.createdDate = gender.createdDate;
        this.updatedDate = gender.updatedDate;
    }
}

export class UpdateGenderDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 50)  
    @ApiProperty()
    name?: string;
}