import { z } from 'zod'

export const fieldTypeEnum = z.enum(['text', 'number', 'email', 'yes_no', 'password'])

export const createFieldInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    label: z.string().min(1).max(100).describe('Display name for the field'),
    labelKey: z.string().min(1).max(100).describe('Slug identifier for the field'),
    type: fieldTypeEnum.describe('Type of field'),
    placeholder: z.string().optional().describe('Placeholder text'),
    description: z.string().optional().describe('Field description'),
    isRequired: z.boolean().default(false).describe('Whether field is required'),
    index: z.number().describe('Index for ordering fields'),
})
export type CreateFieldInputType = z.infer<typeof createFieldInput>

export const updateFieldInput = z.object({
    id: z.string().uuid().describe('Field ID'),
    label: z.string().min(1).max(100).optional().describe('Display name for the field'),
    placeholder: z.string().optional().describe('Placeholder text'),
    description: z.string().optional().describe('Field description'),
    isRequired: z.boolean().optional().describe('Whether field is required'),
})
export type UpdateFieldInputType = z.infer<typeof updateFieldInput>

export const deleteFieldInput = z.object({
    id: z.string().uuid().describe('Field ID'),
})
export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>

export const getFieldsInput = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})
export type GetFieldsInputType = z.infer<typeof getFieldsInput>
