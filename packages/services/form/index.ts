import { db, eq } from '@repo/database'
import { formsTable } from '@repo/database/models/form'
import { formFieldsTable } from '@repo/database/models/form-field'
import { createFormInput, CreateFormInputType, listFormsByUserIdInput, ListFormsByUserIdInputType, getFormByIdInput, GetFormByIdInputType } from './model'

export class FormService {
    public async createForm(payload: CreateFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload)

        const formInsertResult = await db
            .insert(formsTable)
            .values({
                title,
                description: description || null,
                createdBy,
            })
            .returning({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
            })

        if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
            throw new Error('Failed to create form')
        }

        return formInsertResult[0]
    }

    public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload)

        const forms = await db
            .select({
                id: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                createdAt: formsTable.createdAt,
                updatedAt: formsTable.updatedAt,
            })
            .from(formsTable)
            .where(eq(formsTable.createdBy, userId))

        return forms
    }

    public async getFormById(payload: GetFormByIdInputType) {
        const { id } = await getFormByIdInput.parseAsync(payload)

        const formData = await db
            .select({
                formId: formsTable.id,
                title: formsTable.title,
                description: formsTable.description,
                formCreatedAt: formsTable.createdAt,
                formUpdatedAt: formsTable.updatedAt,
                fieldId: formFieldsTable.id,
                fieldLabel: formFieldsTable.label,
                fieldLabelKey: formFieldsTable.labelKey,
                fieldType: formFieldsTable.type,
                fieldPlaceholder: formFieldsTable.placeholder,
                fieldDescription: formFieldsTable.description,
                fieldIsRequired: formFieldsTable.isRequired,
                fieldIndex: formFieldsTable.index,
                fieldCreatedAt: formFieldsTable.createdAt,
                fieldUpdatedAt: formFieldsTable.updatedAt,
            })
            .from(formsTable)
            .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
            .where(eq(formsTable.id, id))
            .orderBy(formFieldsTable.index)

        if (!formData || formData.length === 0) {
            throw new Error('Form not found')
        }

        // Transform the flat result into form with fields array
        const firstRow = formData[0]!
        return {
            id: firstRow.formId,
            title: firstRow.title,
            description: firstRow.description,
            createdAt: firstRow.formCreatedAt,
            updatedAt: firstRow.formUpdatedAt,
            fields: formData
                .filter(row => row.fieldId !== null)
                .map(row => ({
                    id: row.fieldId!,
                    formId: row.formId,
                    label: row.fieldLabel!,
                    labelKey: row.fieldLabelKey!,
                    type: row.fieldType!,
                    placeholder: row.fieldPlaceholder,
                    description: row.fieldDescription,
                    isRequired: row.fieldIsRequired!,
                    index: row.fieldIndex!,
                    createdAt: row.fieldCreatedAt!,
                    updatedAt: row.fieldUpdatedAt!,
                }))
        }
    }
}
