import {
  Injectable,
  Inject,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import * as bcrypt from 'bcrypt';
import { CreateUserDtoRequest, FindUserDtoResponse, FindUserWithPasswordDtoResponse, UpdateUserDtoRequest, UserMethods, usersCollectionName } from './users.document';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);

  constructor(
    @Inject(usersCollectionName)
    private usersCollection: CollectionReference<FindUserWithPasswordDtoResponse>,
  ) { }

  async create(user: CreateUserDtoRequest): Promise<FindUserDtoResponse> {
    const addUser = await UserMethods.createInitialUser(user);
    const docRef = this.usersCollection.doc(addUser.uid);
    await docRef.set({
      ...addUser
    });
    const userDoc = await docRef.get();
    if (!userDoc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const newUser = userDoc.data();
    return new FindUserDtoResponse(newUser);
  }

  async deleteOne(uid: string): Promise<WriteResult> {
    const userRef = this.usersCollection.doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return await userRef.delete();
  }

  async updateOne(uid: string, updateUser: UpdateUserDtoRequest): Promise<FindUserDtoResponse> {
    if (updateUser.password) {
      const salt = await bcrypt.genSalt(10);
      updateUser.password = await bcrypt.hash(
        updateUser.password,
        salt,
      );
    }
    const userRef = this.usersCollection.doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await userRef.update({
      ...updateUser,
      createdDate: Timestamp.fromDate(new Date()),
      updatedDate: Timestamp.fromDate(new Date())
    });
    const userDoc = await userRef.get();
    const updatedUser = userDoc.data();
    return new FindUserDtoResponse(updatedUser);
  }

  async findAll(userFiels?: Partial<FindUserDtoResponse>[]): Promise<FindUserDtoResponse[]> {
    let query: any = this.usersCollection;
    if (userFiels.length > 0) {
      userFiels.forEach((field) => {
        for (const [key, value] of Object.entries(field)) {
          if (key !== "password") {
            query = query.where(key, "==", value);
          }
        }
      });
    }
    const snapshot = await query.get();
    if (snapshot.empty) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const users: FindUserDtoResponse[] = [];
    snapshot.forEach(doc => users.push(new FindUserDtoResponse(doc.data())));
    return users;
  }

  async findOne(uid: string): Promise<FindUserWithPasswordDtoResponse> {
    const userRef = this.usersCollection.doc(uid);
    const doc = await userRef.get();
    if(!doc.exists) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return doc.data();
  }

  // async findOne(serachBy: string): Promise<FindUserWithPasswordDtoResponse> {
  //   const userRef = this.usersCollection.doc(serachBy);
  //   const doc = await userRef.get();
  //   if (!doc.exists) {
  //     const doc = await this.usersCollection.where("email", "==", serachBy).get();
  //     if (doc.empty) {
  //       const doc = await this.usersCollection.where("phoneNumber", "==", serachBy).get();
  //       if (doc.empty) {
  //         throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //       }
  //       else {
  //         return doc.docs[0].data();
  //       }
  //     }
  //     else {
  //       return doc.docs[0].data();
  //     }
  //   }
  //   return doc.data();
  // }
}



const setDocumentFromFirestore = (obj: any): any => {
  let newObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj = { ...newObj, [key]: value };

  }
  return newObj;
}