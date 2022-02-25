import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from '@google-cloud/firestore';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const questionsCollectionName = 'questions';

export class QuestionMethods {
    static createInitialQuestion = async (question: CreateQuestionDtoRequest) => {
        return {
            uid: uuidv4(),
            name: question.name,
            answer1: question.answer1,
            answer2: question.answer2,
            answer3: question.answer3,
            answer4: question.answer4,
            isImportant: question.isImportant,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateQuestionDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer1: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer2: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer3: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer4: string;

    @IsNotEmpty()
    @IsBoolean()
    isImportant: boolean;
}

export class FindQuestionDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    answer1: string;

    @ApiProperty()
    answer2: string;

    @ApiProperty()
    answer3: string;

    @ApiProperty()
    answer4: string;

    @ApiProperty()
    isImportant: boolean;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;

    @ApiProperty()
    updatedDate: Timestamp;

    constructor(question: FindQuestionDtoResponse) {
        this.uid = question.uid;
        this.name = question.name;
        this.answer1 = question.answer1;
        this.answer2 = question.answer2;
        this.answer3 = question.answer3;
        this.answer4 = question.answer4;
        this.isImportant = question.isImportant;
        this.isDeleted = question.isDeleted;
        this.createdDate = question.createdDate;
        this.updatedDate = question.updatedDate;
    }
}

export class UpdateQuestionDtoRequest {
    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    name?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer1?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer2?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer3?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)  
    @ApiProperty()
    answer4?: string;

    @IsOptional()
    @IsBoolean()
    isImportant?: boolean;
}