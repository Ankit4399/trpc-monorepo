import { z } from 'zod'

export const createFormInputModel = z.object({
    title: z.string().min(1).describe('Title of the form'),
    description: z.string().optional().describe('Description of the form'),
})

export const createFormOutputModel = z.object({
    id: z.string().describe('Unique id of the form'),
})

export const listFormsInputModel = z.undefined()

export const listFormsOutputModel = z.array(
    z.object({
        id: z.string().describe('Unique id of the form'),
        title: z.string().describe('Title of the form'),
        description: z.string().nullable().optional().describe('Description of the form'),
        createdAt: z.date().describe('Creation timestamp'),
        updatedAt: z.date().describe('Last update timestamp'),
    })
)
