import { chatsCollectionName } from "src/components/chats/chats.document";
import { countriesCollectionName } from "src/components/countries/countries.document";
import { gendersCollectionName } from "src/components/genders/genders.document";
import { imagesCollectionName } from "src/components/images/images.document";
import { messagesCollectionName } from "src/components/messages/messages.document";
import { questionsCollectionName } from "src/components/questions/questions.document";
import { rejectionsCollectionName } from "src/components/rejections/rejections.document";
import { rewardsCollectionName } from "src/components/rewards/rewards.document";
import { rolesCollectionName } from "src/components/roles/roles.document";
import { usersCollectionName } from "src/components/users/users.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    usersCollectionName,
    chatsCollectionName,
    messagesCollectionName,
    countriesCollectionName,
    gendersCollectionName,
    imagesCollectionName,
    questionsCollectionName,
    rejectionsCollectionName,
    rewardsCollectionName,
    rolesCollectionName
];