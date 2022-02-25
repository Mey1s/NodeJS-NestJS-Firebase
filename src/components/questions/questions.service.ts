import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateQuestionDtoRequest, FindQuestionDtoResponse, QuestionMethods, questionsCollectionName, UpdateQuestionDtoRequest } from './questions.document';

@Injectable()
export class QuestionsService {
    private logger: Logger = new Logger(QuestionsService.name);

    constructor(
        @Inject(questionsCollectionName)
        private questionsCollection: CollectionReference<FindQuestionDtoResponse>,
    ) { }

    async create(question: CreateQuestionDtoRequest): Promise<FindQuestionDtoResponse> {
        const addQuestion = await QuestionMethods.createInitialQuestion(question);
        const docRef = this.questionsCollection.doc(addQuestion.uid);
        await docRef.set({
            ...addQuestion
        });
        const questionDoc = await docRef.get();
        if (!questionDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newQuestion = questionDoc.data();
        return new FindQuestionDtoResponse(newQuestion);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const questionRef = this.questionsCollection.doc(uid);
        const doc = await questionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await questionRef.delete();
    }

    async updateOne(uid: string, updateQuestion: UpdateQuestionDtoRequest): Promise<FindQuestionDtoResponse> {
        const questionRef = this.questionsCollection.doc(uid);
        const doc = await questionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await questionRef.update({
            ...updateQuestion,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const questionDoc = await questionRef.get();
        const updatedQuestion = questionDoc.data();
        return new FindQuestionDtoResponse(updatedQuestion);
    }

    async findAll(questionFields?: Partial<FindQuestionDtoResponse>[]): Promise<FindQuestionDtoResponse[]> {
        let query: any = this.questionsCollection;
        if (questionFields.length > 0) {
            questionFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const questions: FindQuestionDtoResponse[] = [];
        snapshot.forEach(doc => questions.push(new FindQuestionDtoResponse(doc.data())));
        return questions;
    }

    async findOne(uid: string): Promise<FindQuestionDtoResponse> {
        //check if the question contains what the user searched
        const questionRef = this.questionsCollection.doc(uid);
        const doc = await questionRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }

}
