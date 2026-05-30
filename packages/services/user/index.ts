import {db, eq} from '@repo/database'
import {usersTable} from'@repo/database/models/user'
import {createHmac, randomBytes} from 'node:crypto'
import * as JWT from 'jsonwebtoken'

import { createUserWithEmailAndPasswordInput,CreateUserWithEmailAndPasswordInputType, generateUserTokenPayload, GenerateUserTokenPayloadType, signInUserWithEmailAndPasswordInput, SignInUserWithEmailAndPasswordInputType} from './model'
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

    private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType>{
        try {
            const verificationResult =  JWT.verify(token,env.JWT_SECRET) as GenerateUserTokenPayloadType
            return verificationResult;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    public async getUserInfoById(id :string){
        const user = await db.select({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
            profileImageUrl: usersTable.profileImageUrl,
        }).from(usersTable).where(eq(usersTable.id,id));
        if(user.length === 0 || !user) throw new Error(`User with id ${id} not found`);
        return user[0]!;
    }

    private async generatehash(password: string, salt: string){
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
        const {fullName,email,password} = await createUserWithEmailAndPasswordInput.parseAsync(payload)
        const existingUser = await this.getUserByEmail(email);
        if(existingUser) throw new Error('User with this email already exists');

        const salt = randomBytes(16).toString('hex');
        const hash = await this.generatehash(password, salt);

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

    public async signInUserWithEmailAndPassword(payload : SignInUserWithEmailAndPasswordInputType){
        const {email,password} = await signInUserWithEmailAndPasswordInput.parseAsync(payload);
        const existingUser = await this.getUserByEmail(email);

        if(!existingUser) throw new Error('Invalid email or password');

        if(!existingUser.salt || !existingUser.password) throw new Error('Invalid user data');

        const hash = await this.generatehash(password, existingUser.salt);

        if(hash !== existingUser.password) throw new Error('Invalid email or password');

        const {token} = await this.generateUserToken({id : existingUser.id})
        return {
            id : existingUser.id,
            token
        }
    }

    public async verifyAndDecodeUserToken(token: string){
        const {id} =  await this.verifyUserToken(token);
       
        return {
            id
        };
    }
}