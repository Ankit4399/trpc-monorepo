import { z } from 'zod'

export const createFormInputModel = z.object({
    title: z.string().min(1).describe('Title of the form'),
    description: z.string().optional().describe('Description of the form'),
})

export const createFormOutputModel = z.object({
    id: z.string().describe('Unique id of the form'),
})
