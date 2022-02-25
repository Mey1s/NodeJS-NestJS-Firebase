import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { ChatMethods, chatsCollectionName, CreateChatDtoRequest, FindChatDtoResponse, UpdateChatDtoRequest } from './chats.document';

@Injectable()
export class ChatsService {
  private logger: Logger = new Logger(ChatsService.name);

  constructor(
    @Inject(chatsCollectionName)
    private chatsCollection: CollectionReference<FindChatDtoResponse>,
  ) { }

  async create(chat: CreateChatDtoRequest): Promise<FindChatDtoResponse> {
    const addChat = await ChatMethods.createInitialChat(chat);
    const docRef = this.chatsCollection.doc(addChat.uid);
    await docRef.set({
      ...addChat
    });
    const chatDoc = await docRef.get();
    if (!chatDoc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const newChat = chatDoc.data();
    return new FindChatDtoResponse(newChat);
  }

  async deleteOne(uid: string): Promise<WriteResult> {
    const chatRef = this.chatsCollection.doc(uid);
    const doc = await chatRef.get();
    if (!doc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return await chatRef.delete();
  }

  async updateOne(uid: string, updateChat: UpdateChatDtoRequest): Promise<FindChatDtoResponse> {
    const chatRef = this.chatsCollection.doc(uid);
    const doc = await chatRef.get();
    if (!doc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    await chatRef.update({
      ...updateChat,
      createdDate: Timestamp.fromDate(new Date()),
      updatedDate: Timestamp.fromDate(new Date())
    });
    const chatDoc = await chatRef.get();
    const updatedChat = chatDoc.data();
    return new FindChatDtoResponse(updatedChat);
  }

  async findAll(chatFiels?: Partial<FindChatDtoResponse>[]): Promise<FindChatDtoResponse[]> {
    let query: any = this.chatsCollection;
    if (chatFiels.length > 0) {
      chatFiels.forEach((field) => {
        for (const [key, value] of Object.entries(field)) {
          query = query.where(key, "==", value);
        }
      });
    }
    const snapshot = await query.get();
    if (snapshot.empty) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const chats: FindChatDtoResponse[] = [];
    snapshot.forEach(doc => chats.push(new FindChatDtoResponse(doc.data())));
    return chats;
  }

  async findOne(isParticipansOrMessages: string, participansOrMessagesValue: string[]): Promise<FindChatDtoResponse> {
    const chatRef = this.chatsCollection.where(isParticipansOrMessages, "array-contains", participansOrMessagesValue);
    const doc = await chatRef.get();
    if (doc.empty) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return doc.docs[0].data();
  }
}
