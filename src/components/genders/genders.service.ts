import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGenderDtoRequest, FindGenderDtoResponse, GenderMethods, gendersCollectionName, UpdateGenderDtoRequest } from './genders.document';

@Injectable()
export class GendersService {
    private logger: Logger = new Logger(GendersService.name);

    constructor(
        @Inject(gendersCollectionName)
        private gendersCollection: CollectionReference<FindGenderDtoResponse>,
    ) { }

    async create(gender: CreateGenderDtoRequest): Promise<FindGenderDtoResponse> {
        const addgender = await GenderMethods.createInitialGender(gender);
        const docRef = this.gendersCollection.doc(addgender.uid);
        await docRef.set({
            ...addgender
        });
        const genderDoc = await docRef.get();
        if (!genderDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newGender = genderDoc.data();
        return new FindGenderDtoResponse(newGender);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const genderRef = this.gendersCollection.doc(uid);
        const doc = await genderRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await genderRef.delete();
    }

    async updateOne(uid: string, updateGender: UpdateGenderDtoRequest): Promise<FindGenderDtoResponse> {
        const genderRef = this.gendersCollection.doc(uid);
        const doc = await genderRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await genderRef.update({
            ...updateGender,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        }
        );
        const genderDoc = await genderRef.get();
        const updatedGender = genderDoc.data();
        return new FindGenderDtoResponse(updatedGender);
    }

    async findAll(genderFields?: Partial<FindGenderDtoResponse>[]): Promise<FindGenderDtoResponse[]> {
        let query: any = this.gendersCollection;
        if (genderFields.length > 0) {
            genderFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const genders: FindGenderDtoResponse[] = [];
        snapshot.forEach(doc => genders.push(new FindGenderDtoResponse(doc.data())));
        return genders;
    }

    async findOne(uid: string): Promise<FindGenderDtoResponse> {
        //check if the gender contains what the user searched
        const genderRef = this.gendersCollection.doc(uid);
        const doc = await genderRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }

}
