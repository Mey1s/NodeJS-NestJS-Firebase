import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const messagesCollectionName = 'messages';

export class MessageMethods {
    static createInitialMessage = async(message: CreateMessageDtoRequest) => {
        return{
            uid: uuidv4(),
            content: message.content,
            senderId: message.senderId,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateMessageDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    content: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 250)  
    @ApiProperty()
    senderId: string;
}

export class UpdateMessageDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 2500)  
    @ApiProperty()
    content?: string;
}

export class FindMessageDtoResponse {
    @ApiProperty()
    content: string;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;
  
    @ApiProperty()
    updatedDate: Timestamp;

    constructor(message: FindMessageDtoResponse){
        this.content = message.content;
        this.senderId = message.senderId;
        this.isDeleted = message.isDeleted;
        this.createdDate = message.createdDate;
        this.updatedDate = message.updatedDate;
    }
}