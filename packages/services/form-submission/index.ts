import { db } from '@repo/database'
import { formSubmissionsTable } from '@repo/database/models/form-submission'
import { createFormSubmissionInput, CreateFormSubmissionInputType } from './model'

export class FormSubmissionService {
    public async createSubmission(payload: CreateFormSubmissionInputType) {
        const { formId, values } = await createFormSubmissionInput.parseAsync(payload)

        const submissionResult = await db
            .insert(formSubmissionsTable)
            .values({
                formId,
                values,
            })
            .returning({
                id: formSubmissionsTable.id,
                formId: formSubmissionsTable.formId,
                values: formSubmissionsTable.values,
                createdAt: formSubmissionsTable.createdAt,
            })

        if (!submissionResult || submissionResult.length === 0 || !submissionResult[0]?.id) {
            throw new Error('Failed to create form submission')
        }

        const result = submissionResult[0]!
        return {
            id: result.id,
            formId: result.formId,
            values: result.values!,
            createdAt: result.createdAt,
        }
    }
}

export const formSubmissionService = new FormSubmissionService()
