import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRejectionDtoRequest, FindRejectionDtoResponse, RejectionMethods, rejectionsCollectionName, UpdateRejectionDtoRequest } from './rejections.document';

@Injectable()
export class RejectionsService {
    private logger: Logger = new Logger(RejectionsService.name);

    constructor(
        @Inject(rejectionsCollectionName)
        private rejectionsCollection: CollectionReference<FindRejectionDtoResponse>,
    ) { }

    async create(rejection: CreateRejectionDtoRequest): Promise<FindRejectionDtoResponse> {
        const addRejection = await RejectionMethods.createInitialRejection(rejection);
        const docRef = this.rejectionsCollection.doc(addRejection.uid);
        await docRef.set({
            ...addRejection
        });
        const rejectionDoc = await docRef.get();
        if (!rejectionDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newRejection = rejectionDoc.data();
        return new FindRejectionDtoResponse(newRejection);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const rejectionRef = this.rejectionsCollection.doc(uid);
        const doc = await rejectionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await rejectionRef.delete();
    }

    async updateOne(uid: string, updateRejection: UpdateRejectionDtoRequest): Promise<FindRejectionDtoResponse> {
        const rejectionRef = this.rejectionsCollection.doc(uid);
        const doc = await rejectionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await rejectionRef.update({
            ...updateRejection,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const rejectionDoc = await rejectionRef.get();
        const updatedRejection = rejectionDoc.data();
        return new FindRejectionDtoResponse(updatedRejection);
    }

    async findAll(rejectionFields?: Partial<FindRejectionDtoResponse>[]): Promise<FindRejectionDtoResponse[]> {
        let query: any = this.rejectionsCollection;
        if (rejectionFields.length > 0) {
            rejectionFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const rejections: FindRejectionDtoResponse[] = [];
        snapshot.forEach(doc => rejections.push(new FindRejectionDtoResponse(doc.data())));
        return rejections;
    }

    async findOne(uid: string): Promise<FindRejectionDtoResponse> {
        const rejectionRef = this.rejectionsCollection.doc(uid);
        const doc = await rejectionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }
}
