import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRewardDtoRequest, FindRewardDtoResponse, RewardMethods, rewardsCollectionName, UpdateRewardDtoRequest } from './rewards.document';

@Injectable()
export class RewardsService {
    private logger: Logger = new Logger(RewardsService.name);

    constructor(
        @Inject(rewardsCollectionName)
        private rewardsCollection: CollectionReference<FindRewardDtoResponse>,
    ) { }

    async create(reward: CreateRewardDtoRequest): Promise<FindRewardDtoResponse> {
        const addReward = await RewardMethods.createInitialReward(reward);
        const docRef = this.rewardsCollection.doc(addReward.uid);
        const test = await docRef.set({
            ...addReward
        });
        const rewardDoc = await docRef.get();
        if (!rewardDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newReward = rewardDoc.data();
        return new FindRewardDtoResponse(newReward);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const rewardRef = this.rewardsCollection.doc(uid);
        const doc = await rewardRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await rewardRef.delete();
    }

    async updateOne(uid: string, updateReward: UpdateRewardDtoRequest): Promise<FindRewardDtoResponse> {
        const rewardRef = this.rewardsCollection.doc(uid);
        const doc = await rewardRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await rewardRef.update({
            ...updateReward, createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const rewardDoc = await rewardRef.get();
        const updatedReward = rewardDoc.data();
        return new FindRewardDtoResponse(updatedReward);
    }

    async findAll(rewardFields?: Partial<FindRewardDtoResponse>[]): Promise<FindRewardDtoResponse[]> {
        let query: any = this.rewardsCollection;
        if (rewardFields.length > 0) {
            rewardFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const rewards: FindRewardDtoResponse[] = [];
        snapshot.forEach(doc => rewards.push(new FindRewardDtoResponse(doc.data())));
        return rewards;
    }

    async findOne(uid: string): Promise<FindRewardDtoResponse> {
        const rewardRef = this.rewardsCollection.doc(uid);
        const doc = await rewardRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }
}
