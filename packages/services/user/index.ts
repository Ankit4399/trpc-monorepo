import {db, eq} from '@repo/database'
import {usersTable} from'@repo/database/models/user'
import {createHmac, randomBytes} from 'node:crypto'
import * as JWT from 'jsonwebtoken'

import { createUserWithEmailAndPasswordInput,CreateUserWithEmailAndPasswordInputType, generateUserTokenPayload, GenerateUserTokenPayloadType} from './model'
import { env } from '../env'

export class UserService {

    private async getUserByEmail(email: string){
        const result = await db.select().from(usersTable).where(eq(usersTable.email,email));
        if(result.length === 0 || !result) return null;
        return result[0];
    }

    private async generateUserToken(payload : GenerateUserTokenPayloadType){
        const {id} = await generateUserTokenPayload.parseAsync(payload);
        const token = JWT.sign({id},env.JWT_SECRET)

        return {token}
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const {fullName,email,password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)
        const existingUser = await this.getUserByEmail(email);
        if(existingUser) throw new Error('User with this email already exists');

        const salt = randomBytes(16).toString('hex');
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        const userInsertResult = await db.insert(usersTable).values({fullName,email,password:hash,salt}).returning({
            id: usersTable.id,
        });

        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error('Failed to create user');

        const userId = userInsertResult[0].id;
        const {token} = await this.generateUserToken({id : userId})
        return{
            id: userId,
            token
        }
    }
}