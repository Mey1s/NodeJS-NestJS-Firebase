import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from "@google-cloud/firestore";
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const now = new Date();
const maxDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

interface QuestionIdAndAnswerI {
  questionId: string;
  answer: string;
}

export const usersCollectionName = 'users';

export class UserMethods {
  static createInitialUser = async (user: CreateUserDtoRequest) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(
      user.password,
      salt,
    );
    return{
      uid: uuidv4(),
      roleId: '',
      name: user.name,
      authProvider: user.authProvider,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: encryptedPassword,
      genderId: '',
      showGendersIds: [],
      birthday: Timestamp.fromDate(minDate),
      minAgeRange: 18,
      maxAgeRange: 120,
      usersLikedYouIds: [],
      usersYouLikedIds: [],
      matchesIds: [],
      countryId: '',
      city: '',
      description: '',
      questionsIdsAndAnswers: [],
      imagesIds: [],
      rewardsIds: [],
      chatsIds: [],
      strikeDays: 0,
      rejectionsIds: [],
      isDeleted: false,
      createdDate: Timestamp.fromDate(now),
      updatedDate: Timestamp.fromDate(now)
    }
  }
}

export class CreateUserDtoRequest {
  @IsNotEmpty()
  @IsString()
  @Length(5, 250)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 250)
  @ApiProperty()
  authProvider: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(5, 250)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(10, 250)
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 500)
  @ApiProperty()
  password: string;
}

export class UpdateUserDtoRequest {
  @IsOptional()
  @IsString()
  @Length(5, 250)
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsEmail()
  @Length(5, 250)
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  @Length(10, 250)
  @ApiProperty()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @Length(8, 250)
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @Length(10, 250)
  @ApiProperty()
  genderId?: string;

  @IsOptional()
  //array of strings: @IsString({each: true})
  @IsArray()
  //TODO: ADD LENGTH OF EACH ID
  @Type(() => String)
  @ArrayMinSize(1)
  @ApiProperty()
  showGendersIds?: string[];

  @IsOptional()
  @IsDate()
  @ApiProperty()
  birthday?: Timestamp;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  @ApiProperty()
  minAgeRange?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  @ApiProperty()
  maxAgeRange?: number;

  @IsOptional()
  @IsArray()
  @Type(() => String) 
  @ArrayMinSize(0)
  @ApiProperty()
  usersYouLikedIds?: string[];

  @IsOptional()
  @IsString()
  @Length(10, 250)
  @ApiProperty()
  countryId?: string;

  @IsOptional()
  @IsString()
  @Length(2, 250)  
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)  
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsArray()
  @Type(()=> String)
  @ArrayMinSize(0)
  @ApiProperty()
  questionsIdsAndAnswers?: QuestionIdAndAnswerI[];

  @IsOptional()
  @IsArray()
  @Type(()=> String)
  @ArrayMinSize(0)
  @ApiProperty()
  imagesIds?: string[];

  @IsOptional()
  @IsArray()
  @Type(()=> String)
  @ArrayMinSize(0)
  @ApiProperty()
  chatsIds?: string[];

  @IsOptional()
  @IsDate()
  @ApiProperty()
  createdDate?: Timestamp;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  updatedDate?: Timestamp;
}

export class FindUserDtoResponse {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  authProvider: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  genderId: string;

  @ApiProperty()
  showGendersIds: string[];

  @ApiProperty()
  birthday: Timestamp;

  @ApiProperty()
  minAgeRange: number;

  @ApiProperty()
  maxAgeRange: number;

  @ApiProperty()
  usersLikedYouIds: string[];

  @ApiProperty()
  usersYouLikedIds: string[];

  @ApiProperty()
  matchesIds: string[];

  @ApiProperty()
  countryId: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  questionsIdsAndAnswers: QuestionIdAndAnswerI[];

  @ApiProperty()
  imagesIds: string[];

  @ApiProperty()
  rewardsIds: string[];

  @ApiProperty()
  chatsIds: string[];

  @ApiProperty()
  strikeDays: number;

  @ApiProperty()
  rejectionsIds: string[];

  @ApiProperty()
  isDeleted: boolean

  @ApiProperty()
  createdDate: Timestamp;

  @ApiProperty()
  updatedDate: Timestamp;

  constructor(user: FindUserWithPasswordDtoResponse){
    this.authProvider = user.authProvider;
    this.birthday = user.birthday;
    this.chatsIds = user.chatsIds;
    this.city = user.city;
    this.countryId = user.countryId;
    this.createdDate = user.createdDate;
    this.description = user.description;
    this.email = user.email;
    this.genderId = user.genderId;
    this.imagesIds = user.imagesIds;
    this.isDeleted = user.isDeleted;
    this.matchesIds = user.matchesIds;
    this.maxAgeRange = user.maxAgeRange;
    this.minAgeRange = user.minAgeRange;
    this.name = user.name;
    this.phoneNumber = user.phoneNumber;
    this.questionsIdsAndAnswers = user.questionsIdsAndAnswers;
    this.rejectionsIds = user.rejectionsIds;
    this.rewardsIds = user.rewardsIds;
    this.roleId = user.roleId;
    this.showGendersIds = user.showGendersIds;
    this.strikeDays = user.strikeDays;
    this.uid = user.uid;
    this.updatedDate = user.updatedDate;
    this.usersLikedYouIds = user.usersLikedYouIds;
    this.usersYouLikedIds = user.usersLikedYouIds;
  }
}

export class FindUserWithPasswordDtoResponse {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  authProvider: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  genderId: string;

  @ApiProperty()
  showGendersIds: string[];

  @ApiProperty()
  birthday: Timestamp;

  @ApiProperty()
  minAgeRange: number;

  @ApiProperty()
  maxAgeRange: number;

  @ApiProperty()
  usersLikedYouIds: string[];

  @ApiProperty()
  usersYouLikedIds: string[];

  @ApiProperty()
  matchesIds: string[];

  @ApiProperty()
  countryId: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  questionsIdsAndAnswers: QuestionIdAndAnswerI[];

  @ApiProperty()
  imagesIds: string[];

  @ApiProperty()
  rewardsIds: string[];

  @ApiProperty()
  chatsIds: string[];

  @ApiProperty()
  strikeDays: number;

  @ApiProperty()
  rejectionsIds: string[];

  @ApiProperty()
  isDeleted: boolean

  @ApiProperty()
  createdDate: Timestamp;

  @ApiProperty()
  updatedDate: Timestamp;

}

export class CreateTokenResponse {
  @ApiProperty()
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}

//FieldValue.serverTimestamp()