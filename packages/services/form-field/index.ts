import { db, eq } from '@repo/database'
import { formFieldsTable } from '@repo/database/models/form-field'
import {
    createFieldInput,
    CreateFieldInputType,
    updateFieldInput,
    UpdateFieldInputType,
    deleteFieldInput,
    DeleteFieldInputType,
    getFieldsInput,
    GetFieldsInputType,
} from './model'

export class FormFieldService {
    private async getFieldById(id: string) {
        const result = await db.select().from(formFieldsTable).where(eq(formFieldsTable.id, id))
        if (result.length === 0 || !result) return null
        return result[0]
    }

    public async createField(payload: CreateFieldInputType) {
        const { formId, label, labelKey, type, placeholder, description, isRequired, index } = 
            await createFieldInput.parseAsync(payload)

        const fieldInsertResult = await db
            .insert(formFieldsTable)
            .values({
                formId,
                label,
                labelKey,
                type,
                placeholder: placeholder || null,
                description: description || null,
                isRequired,
                index: String(index),
            })
            .returning({
                id: formFieldsTable.id,
                formId: formFieldsTable.formId,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                type: formFieldsTable.type,
                placeholder: formFieldsTable.placeholder,
                description: formFieldsTable.description,
                isRequired: formFieldsTable.isRequired,
                index: formFieldsTable.index,
                createdAt: formFieldsTable.createdAt,
            })

        if (!fieldInsertResult || fieldInsertResult.length === 0 || !fieldInsertResult[0]?.id) {
            throw new Error('Failed to create form field')
        }

        return fieldInsertResult[0]!
    }

    public async updateField(payload: UpdateFieldInputType) {
        const { id, label, placeholder, description, isRequired } = 
            await updateFieldInput.parseAsync(payload)

        const existingField = await this.getFieldById(id)
        if (!existingField) throw new Error(`Field with id ${id} not found`)

        const updateData: Record<string, any> = {}
        if (label !== undefined) updateData.label = label
        if (placeholder !== undefined) updateData.placeholder = placeholder
        if (description !== undefined) updateData.description = description
        if (isRequired !== undefined) updateData.isRequired = isRequired

        const fieldUpdateResult = await db
            .update(formFieldsTable)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id,
                formId: formFieldsTable.formId,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                type: formFieldsTable.type,
                placeholder: formFieldsTable.placeholder,
                description: formFieldsTable.description,
                isRequired: formFieldsTable.isRequired,
                index: formFieldsTable.index,
                updatedAt: formFieldsTable.updatedAt,
            })

        if (!fieldUpdateResult || fieldUpdateResult.length === 0) {
            throw new Error('Failed to update form field')
        }

        return fieldUpdateResult[0]!
    }

    public async deleteField(payload: DeleteFieldInputType) {
        const { id } = await deleteFieldInput.parseAsync(payload)

        const existingField = await this.getFieldById(id)
        if (!existingField) throw new Error(`Field with id ${id} not found`)

        const deleteResult = await db
            .delete(formFieldsTable)
            .where(eq(formFieldsTable.id, id))
            .returning({
                id: formFieldsTable.id,
            })

        if (!deleteResult || deleteResult.length === 0) {
            throw new Error('Failed to delete form field')
        }

        return { success: true, id: deleteResult[0]!.id }
    }

    public async getFields(payload: GetFieldsInputType) {
        const { formId } = await getFieldsInput.parseAsync(payload)

        const fields = await db
            .select({
                id: formFieldsTable.id,
                formId: formFieldsTable.formId,
                label: formFieldsTable.label,
                labelKey: formFieldsTable.labelKey,
                type: formFieldsTable.type,
                placeholder: formFieldsTable.placeholder,
                description: formFieldsTable.description,
                isRequired: formFieldsTable.isRequired,
                index: formFieldsTable.index,
                createdAt: formFieldsTable.createdAt,
                updatedAt: formFieldsTable.updatedAt,
            })
            .from(formFieldsTable)
            .where(eq(formFieldsTable.formId, formId))
            .orderBy(formFieldsTable.index)

        return fields
    }
}
