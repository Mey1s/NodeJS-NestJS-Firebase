import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const imagesCollectionName = 'images';

export class ImageMethods {
    static createInitialImage = async (image: CreateImageDtoRequest) => {
        return {
            uid: uuidv4(),
            destination: image.destination,
            name: image.name,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }   
    }
}

export class CreateImageDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    destination: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    name: string;
}

export class FindImageDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    destination: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;

    @ApiProperty()
    updatedDate: Timestamp;

    constructor(image: FindImageDtoResponse) {
        this.uid = image.uid;
        this.destination = image.destination;
        this.name = image.name;
        this.isDeleted = image.isDeleted;
        this.createdDate = image.createdDate;
        this.updatedDate = image.updatedDate;
    }
}

export class UpdateImageDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    destination?: string;

    @IsOptional()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    name?: string;
}