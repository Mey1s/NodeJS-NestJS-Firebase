import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateImageDtoRequest, FindImageDtoResponse, ImageMethods, imagesCollectionName, UpdateImageDtoRequest } from './images.document';

@Injectable()
export class ImagesService {
    private logger: Logger = new Logger(ImagesService.name);

    constructor(
        @Inject(imagesCollectionName)
        private imagesCollection: CollectionReference<FindImageDtoResponse>,
    ) { }

    async create(image: CreateImageDtoRequest): Promise<FindImageDtoResponse> {
        const addimage = await ImageMethods.createInitialImage(image);
        const docRef = this.imagesCollection.doc(addimage.uid);
        await docRef.set({
            ...addimage
        });
        const imageDoc = await docRef.get();
        if (!imageDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newImage = imageDoc.data();
        return new FindImageDtoResponse(newImage);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const imageRef = this.imagesCollection.doc(uid);
        const doc = await imageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await imageRef.delete();
    }

    async updateOne(uid: string, updateimage: UpdateImageDtoRequest): Promise<FindImageDtoResponse> {
        const imageRef = this.imagesCollection.doc(uid);
        const doc = await imageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await imageRef.update({
            ...updateimage,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const imageDoc = await imageRef.get();
        const updatedChat = imageDoc.data();
        return new FindImageDtoResponse(updatedChat);
    }

    async findAll(imageFields?: Partial<FindImageDtoResponse>[]): Promise<FindImageDtoResponse[]> {
        let query: any = this.imagesCollection;
        if (imageFields.length > 0) {
            imageFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const images: FindImageDtoResponse[] = [];
        snapshot.forEach(doc => images.push(new FindImageDtoResponse(doc.data())));
        return images;
    }

    async findOne(uid: string): Promise<FindImageDtoResponse> {
        const imageRef = this.imagesCollection.doc(uid);
        const doc = await imageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }
}
