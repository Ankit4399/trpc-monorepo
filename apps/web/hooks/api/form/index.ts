
import { trpc } from "~/trpc/client"

export const useCreateForm = ()=>{
    const utils = trpc.useUtils();
    const {mutateAsync : createFormAsync,
         mutate : createForm,
         error,
         failureCount,
         isError,
         isIdle,
         isSuccess,
         status
        } 
         = trpc.form.createForm.useMutation({
            onSuccess : async ()=>{
                // Invalidate form queries here if you add them later
                await utils.form.invalidate();
            }
         })

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useListForms = () => {
    const {
        data: forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.listForms.useQuery()

    return {
        forms,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    }
}

export const useCreateField = () => {
    const utils = trpc.useUtils();
    const {mutateAsync : createFieldAsync,
         mutate : createField,
         error,
         failureCount,
         isError,
         isIdle,
         isSuccess,
         status
        } 
         = trpc.form.createField.useMutation({
            onSuccess : async ()=>{
                await utils.form.getFields.invalidate();
            }
         })

    return {
        createFieldAsync,
        createField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useUpdateField = () => {
    const utils = trpc.useUtils();
    const {mutateAsync : updateFieldAsync,
         mutate : updateField,
         error,
         failureCount,
         isError,
         isIdle,
         isSuccess,
         status
        } 
         = trpc.form.updateField.useMutation({
            onSuccess : async ()=>{
                await utils.form.getFields.invalidate();
            }
         })

    return {
        updateFieldAsync,
        updateField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useDeleteField = () => {
    const utils = trpc.useUtils();
    const {mutateAsync : deleteFieldAsync,
         mutate : deleteField,
         error,
         failureCount,
         isError,
         isIdle,
         isSuccess,
         status
        } 
         = trpc.form.deleteField.useMutation({
            onSuccess : async ()=>{
                await utils.form.getFields.invalidate();
            }
         })

    return {
        deleteFieldAsync,
        deleteField,
        error,
        failureCount,
        isError,
        isIdle,
        isSuccess,
        status
    }
}

export const useGetFields = (formId: string) => {
    const {
        data: fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    } = trpc.form.getFields.useQuery({ formId })

    return {
        fields,
        error,
        isFetched,
        isFetching,
        isLoading,
        status,
    }
}
