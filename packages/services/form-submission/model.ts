import { z } from 'zod'

export const formSubmissionValueInput = z.object({
    formFieldId: z.string().uuid().describe('UUID of the form field'),
    value: z.string().describe('User response value'),
})
export type FormSubmissionValueInputType = z.infer<typeof formSubmissionValueInput>

export const createFormSubmissionInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    values: z.array(formSubmissionValueInput).describe('Array of field responses'),
})
export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>
