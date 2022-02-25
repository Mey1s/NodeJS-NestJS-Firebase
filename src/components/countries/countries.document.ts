import { Timestamp } from '@google-cloud/firestore';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export const countriesCollectionName = 'countries';

export class CountryMethods {
    static createInitialCountry = async (country: CreateCountryDtoRequest) => {
        return {
            uid: uuidv4(),
            name: country.name,
            code: country.code,
            isDeleted: false,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
    }
}

export class CreateCountryDtoRequest {
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    @ApiProperty()
    code: string;
}

export class FindCountryDtoResponse {
    @ApiProperty()
    uid: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    isDeleted: boolean;

    @ApiProperty()
    createdDate: Timestamp;
    
    @ApiProperty()
    updatedDate: Timestamp;

    constructor(country: FindCountryDtoResponse){
        this.uid = country.uid;
        this.name = country.name;
        this.code = country.code;
        this.isDeleted = country.isDeleted;
        this.createdDate = country.createdDate;
        this.updatedDate = country.updatedDate;
    }
}