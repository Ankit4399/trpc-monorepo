import { db, eq } from '@repo/database'
import { formSubmissionsTable } from '@repo/database/models/form-submission'
import { createFormSubmissionInput, CreateFormSubmissionInputType, getFormSubmissionsInput, GetFormSubmissionsInputType } from './model'

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

    public async getFormSubmissions(payload: GetFormSubmissionsInputType) {
        const { formId } = await getFormSubmissionsInput.parseAsync(payload)

        const submissions = await db
            .select({
                id: formSubmissionsTable.id,
                formId: formSubmissionsTable.formId,
                values: formSubmissionsTable.values,
                createdAt: formSubmissionsTable.createdAt,
                updatedAt: formSubmissionsTable.updatedAt,
            })
            .from(formSubmissionsTable)
            .where(eq(formSubmissionsTable.formId, formId))

        return submissions.map(submission => ({
            id: submission.id,
            formId: submission.formId,
            values: submission.values!,
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt,
        }))
    }
}

export const formSubmissionService = new FormSubmissionService()
