import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const rejectionsCollectionName = 'rejections';

export class RejectionMethods {
    static createInitialRejection = async (rejection: CreateRejectionDtoRequest) => {
        return {
            uid: uuidv4(),
            name: rejection.name,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())        
        }
    }
}


export class CreateRejectionDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    name: string;
}

export class FindRejectionDtoResponse {
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

    constructor(rejection: FindRejectionDtoResponse) {
        this.uid = rejection.uid;
        this.name = rejection.name;
        this.isDeleted = rejection.isDeleted;
        this.createdDate = rejection.createdDate;
        this.updatedDate = rejection.updatedDate;
    }
}

export class UpdateRejectionDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    name?: string;
}