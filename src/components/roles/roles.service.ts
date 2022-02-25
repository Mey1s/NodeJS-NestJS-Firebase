import { CollectionReference, Timestamp, WriteResult } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRoleDtoRequest, FindRoleDtoResponse, roleMethods, rolesCollectionName, UpdateRoleDtoRequest } from './roles.document';

@Injectable()
export class RolesService {
    private logger: Logger = new Logger(RolesService.name);

    constructor(
        @Inject(rolesCollectionName)
        private rolesCollection: CollectionReference<FindRoleDtoResponse>,
    ) { }

    async create(role: CreateRoleDtoRequest): Promise<FindRoleDtoResponse> {
        const addrole = await roleMethods.createInitialrole(role);
        const docRef = this.rolesCollection.doc(addrole.uid);
        await docRef.set({
            ...addrole
        });
        const roleDoc = await docRef.get();
        if (!roleDoc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const newRole = roleDoc.data();
        return new FindRoleDtoResponse(newRole);
    }

    async deleteOne(uid: string): Promise<WriteResult> {
        const roleRef = this.rolesCollection.doc(uid);
        const doc = await roleRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return await roleRef.delete();
    }

    async updateOne(uid: string, updateRole: UpdateRoleDtoRequest): Promise<FindRoleDtoResponse> {
        const roleRef = this.rolesCollection.doc(uid);
        const doc = await roleRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        await roleRef.update({
            ...updateRole,
            createdDate: Timestamp.fromDate(new Date()),
            updatedDate: Timestamp.fromDate(new Date())
        });
        const roleDoc = await roleRef.get();
        const updatedRole = roleDoc.data();
        return new FindRoleDtoResponse(updatedRole);
    }

    async findAll(roleFields?: Partial<FindRoleDtoResponse>[]): Promise<FindRoleDtoResponse[]> {
        let query: any = this.rolesCollection;
        if (roleFields.length > 0) {
            roleFields.forEach((field) => {
                for (const [key, value] of Object.entries(field)) {
                    query = query.where(key, "==", value);
                }
            });
        }
        const snapshot = await query.get();
        if (snapshot.empty) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        const roles: FindRoleDtoResponse[] = [];
        snapshot.forEach(doc => roles.push(new FindRoleDtoResponse(doc.data())));
        return roles;
    }

    async findOne(uid: string): Promise<FindRoleDtoResponse> {
        const roleRef = this.rolesCollection.doc(uid);
        const doc = await roleRef.get();
        if (!doc.exists) {
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
        }
        return doc.data();
    }
}