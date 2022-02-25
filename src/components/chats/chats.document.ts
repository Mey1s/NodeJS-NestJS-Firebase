import { Timestamp } from "@google-cloud/firestore";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsOptional } from "class-validator";
import { v4 as uuidv4 } from 'uuid';

export const chatsCollectionName = 'chats';

export class ChatMethods {
    static createInitialChat = async (chat: CreateChatDtoRequest) => {
        return {
            uid: uuidv4(),
            participantsIds: chat.participantsIds,
            messagesIds: [],
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }

    static AddUserToChat = (participantsIds:string[], userId: string) => {
        return {
            participantsIds: [...participantsIds, userId],
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }

    static RemoveUserFromChat = (participantsIds: string[], userId: string) => {
        return {
            participantsIds: participantsIds.filter(participant => participant !== userId),
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }

    static AddMessageToChat = (messagesIds:string[], messageId: string) => {
        return {
            messagesIds: [...messagesIds, messageId],
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }

    static RemoveMessageFromChat = (messagesIds: string[], userId: string) => {
        return {
            messagesIds: messagesIds.filter(message => message !== userId),
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateChatDtoRequest {
    @IsNotEmpty()
    @IsArray()
    //TODO: ADD LENGTH OF EACH ID
    @Type(() => String)
    @ArrayMinSize(2)
    @ApiProperty()
    participantsIds: []
}

export class FindChatDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    participantsIds: string[];
    
    @ApiProperty()
    messagesIds: string[];

    @ApiProperty()
    isDeleted: boolean;
    
    @ApiProperty()
    createdDate: Timestamp;
    
    @ApiProperty()
    updatedDate: Timestamp;

    constructor(chat: FindChatDtoResponse){
        this.uid = chat.uid;
        this.participantsIds = chat.participantsIds;
        this.messagesIds = chat.messagesIds;
        this.isDeleted = chat.isDeleted;
        this.createdDate;
        this.updatedDate = chat.updatedDate;
    }
}

export class UpdateChatDtoRequest {
    @IsNotEmpty()
    @IsArray()
    //TODO: ADD LENGTH OF EACH ID
    @Type(() => String)
    @ApiProperty()
    participantsIds?: [];

    @IsNotEmpty()
    @IsArray()
    //TODO: ADD LENGTH OF EACH ID
    @Type(() => String)
    @ApiProperty()
    messagesIds?: string[];
    
    @IsOptional()
    @IsDate()
    @ApiProperty()
    createdDate?: Timestamp;
  
    @IsOptional()
    @IsDate()
    @ApiProperty()
    updatedDate?: Timestamp;
}