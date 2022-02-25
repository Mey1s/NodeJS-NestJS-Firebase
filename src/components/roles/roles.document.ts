import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from '@google-cloud/firestore';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const rolesCollectionName = 'roles';

export class roleMethods {
    static createInitialrole = async (role: CreateRoleDtoRequest) => {
        return {
            uid: uuidv4(),
            title: role.title,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }

    }
}

export class CreateRoleDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 250)
    @ApiProperty()
    title: string;
}

export class FindRoleDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;

    @ApiProperty()
    updatedDate: Timestamp;

    constructor(role: FindRoleDtoResponse) {
        this.uid = role.uid;
        this.title = role.title;
        this.isDeleted = role.isDeleted;
        this.createdDate = role.createdDate;
        this.updatedDate = role.updatedDate;
    }
}

export class UpdateRoleDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 250)
    @ApiProperty()
    title?: string;
}