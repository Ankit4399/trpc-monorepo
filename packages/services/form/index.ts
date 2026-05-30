import { db, eq } from '@repo/database'
import { formsTable } from '@repo/database/models/form'
import { createFormInput, CreateFormInputType, listFormsByUserIdInput, ListFormsByUserIdInputType } from './model'

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
}
