import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateMessageDtoRequest, FindMessageDtoResponse, MessageMethods, messagesCollectionName, UpdateMessageDtoRequest } from './messages.document';

@Injectable()
export class MessagesService {
    private logger: Logger = new Logger(MessagesService.name);

    constructor(
        @Inject(messagesCollectionName)
        private messagesCollection: CollectionReference<FindMessageDtoResponse>,
    ) { }

    async create(message: CreateMessageDtoRequest): Promise<FindMessageDtoResponse> {
        const addMessage = await MessageMethods.createInitialMessage(message);
        const docRef = this.messagesCollection.doc(addMessage.uid);
        await docRef.set({
            ...addMessage
        });
        const messageDoc = await docRef.get();
        if (!messageDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newMessage = messageDoc.data();
        return new FindMessageDtoResponse(newMessage);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const messageRef = this.messagesCollection.doc(uid);
        const doc = await messageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await messageRef.delete();
    }

    async updateOne(uid: string, updateMessage: UpdateMessageDtoRequest): Promise<FindMessageDtoResponse> {
        const messageRef = this.messagesCollection.doc(uid);
        const doc = await messageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await messageRef.update({
            ...updateMessage,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const messageDoc = await messageRef.get();
        const updatedMessage = messageDoc.data();
        return new FindMessageDtoResponse(updatedMessage);
    }

    async findAll(messageFields?: Partial<FindMessageDtoResponse>[]): Promise<FindMessageDtoResponse[]> {
        let query: any = this.messagesCollection;
        if (messageFields.length > 0) {
            messageFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const messages: FindMessageDtoResponse[] = [];
        snapshot.forEach(doc => messages.push(new FindMessageDtoResponse(doc.data())));
        return messages;
    }

    async findOne(uid: string): Promise<FindMessageDtoResponse> {
        //check if the message contains what the user searched
        const messageRef = this.messagesCollection.doc(uid);
        const doc = await messageRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }
}
