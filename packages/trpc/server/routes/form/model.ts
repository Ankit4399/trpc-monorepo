import { z } from 'zod'

// Form Fields Models - Enum
const fieldTypeEnum = z.enum(['text', 'number', 'email', 'yes_no', 'password'])

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

export const getFormByIdInputModel = z.object({
    id: z.string().uuid().describe('UUID of the form'),
})

export const getFormByIdOutputModel = z.object({
    id: z.string().describe('Unique id of the form'),
    title: z.string().describe('Title of the form'),
    description: z.string().nullable().optional().describe('Description of the form'),
    createdAt: z.date().describe('Creation timestamp'),
    updatedAt: z.date().describe('Last update timestamp'),
    fields: z.array(
        z.object({
            id: z.string().describe('Unique id of the field'),
            formId: z.string().describe('Form ID'),
            label: z.string().describe('Display name'),
            labelKey: z.string().describe('Slug identifier'),
            type: fieldTypeEnum.describe('Field type'),
            placeholder: z.string().nullable().optional().describe('Placeholder text'),
            description: z.string().nullable().optional().describe('Description'),
            isRequired: z.boolean().describe('Is required'),
            index: z.string().describe('Field index'),
            createdAt: z.date().describe('Creation timestamp'),
            updatedAt: z.date().describe('Last update timestamp'),
        })
    ).describe('Array of form fields'),
})

export const createFieldInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
    label: z.string().min(1).max(100).describe('Display name for the field'),
    labelKey: z.string().min(1).max(100).describe('Slug identifier for the field'),
    type: fieldTypeEnum.describe('Type of field'),
    placeholder: z.string().optional().describe('Placeholder text'),
    description: z.string().optional().describe('Field description'),
    isRequired: z.boolean().default(false).describe('Whether field is required'),
    index: z.number().describe('Index for ordering fields'),
})

export const createFieldOutputModel = z.object({
    id: z.string().describe('Unique id of the field'),
    formId: z.string().describe('Form ID'),
    label: z.string().describe('Display name'),
    labelKey: z.string().describe('Slug identifier'),
    type: fieldTypeEnum.describe('Field type'),
    placeholder: z.string().nullable().describe('Placeholder text'),
    description: z.string().nullable().describe('Description'),
    isRequired: z.boolean().describe('Is required'),
    index: z.string().describe('Field index'),
    createdAt: z.date().describe('Creation timestamp'),
})

export const updateFieldInputModel = z.object({
    id: z.string().uuid().describe('Field ID'),
    label: z.string().min(1).max(100).optional().describe('Display name for the field'),
    placeholder: z.string().optional().describe('Placeholder text'),
    description: z.string().optional().describe('Field description'),
    isRequired: z.boolean().optional().describe('Whether field is required'),
})

export const updateFieldOutputModel = z.object({
    id: z.string().describe('Unique id of the field'),
    formId: z.string().describe('Form ID'),
    label: z.string().describe('Display name'),
    labelKey: z.string().describe('Slug identifier'),
    type: fieldTypeEnum.describe('Field type'),
    placeholder: z.string().nullable().describe('Placeholder text'),
    description: z.string().nullable().describe('Description'),
    isRequired: z.boolean().describe('Is required'),
    index: z.string().describe('Field index'),
    updatedAt: z.date().describe('Last update timestamp'),
})

export const deleteFieldInputModel = z.object({
    id: z.string().uuid().describe('Field ID'),
})

export const deleteFieldOutputModel = z.object({
    success: z.boolean().describe('Success status'),
    id: z.string().describe('Deleted field ID'),
})

export const getFieldsInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})

export const getFieldsOutputModel = z.array(
    z.object({
        id: z.string().describe('Unique id of the field'),
        formId: z.string().describe('Form ID'),
        label: z.string().describe('Display name'),
        labelKey: z.string().describe('Slug identifier'),
        type: fieldTypeEnum.describe('Field type'),
        placeholder: z.string().nullable().optional().describe('Placeholder text'),
        description: z.string().nullable().optional().describe('Description'),
        isRequired: z.boolean().describe('Is required'),
        index: z.string().describe('Field index'),
        createdAt: z.date().describe('Creation timestamp'),
        updatedAt: z.date().describe('Last update timestamp'),
    })
)
