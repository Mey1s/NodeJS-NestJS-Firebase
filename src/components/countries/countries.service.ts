import { CollectionReference, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { countriesCollectionName, CountryMethods, CreateCountryDtoRequest, FindCountryDtoResponse } from './countries.document';

@Injectable()
export class CountriesService {
    private logger: Logger = new Logger(CountriesService.name);

    constructor(
        @Inject(countriesCollectionName)
        private countriesCollection: CollectionReference<FindCountryDtoResponse>,
      ) { }
        
      async create(country: CreateCountryDtoRequest): Promise<FindCountryDtoResponse>{
        const addcountry = await CountryMethods.createInitialCountry(country);
        const docRef = this.countriesCollection.doc(addcountry.uid);
        await docRef.set({
            ...addcountry
        });
        const countryDoc = await docRef.get();
        if(!countryDoc.exists){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newCountry = countryDoc.data();
        return new FindCountryDtoResponse(newCountry);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const countryRef = this.countriesCollection.doc(uid);
        const doc = await countryRef.get();
        if(!doc.exists){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await countryRef.delete();
    }

    async findAll(countryFiels?: Partial<FindCountryDtoResponse>[]): Promise<FindCountryDtoResponse[]> {
        let query: any = this.countriesCollection;
        if (countryFiels.length > 0) {
          countryFiels.forEach((field) => {
            for (const [key, value] of Object.entries(field)) {
                query = query.where(key, "==", value);
            }
          });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
          throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const countrys: FindCountryDtoResponse[] = [];
        snapshot.forEach(doc => countrys.push(new FindCountryDtoResponse(doc.data())));
        return countrys;
      }

      async findOne(uid: string): Promise<FindCountryDtoResponse> {
        const countryRef = this.countriesCollection.doc(uid);
        const doc = await countryRef.get();
        if(!doc.exists){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
      } 
}
