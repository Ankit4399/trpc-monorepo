import {z} from 'zod'

export const createUserWithEmailAndPasswordInput = z.object({
    fullName: z.string().describe('Full name of the user'),
    email: z.email().describe('Email address of the user'),
    password: z.string().min(8).describe('Password for the user account'),
})

// type name starts with capital letter and is in camel case
export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>