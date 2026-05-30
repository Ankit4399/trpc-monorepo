import { formService } from "../../services";
import { formFieldService } from "../../services";
import { formSubmissionService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { 
    createFormInputModel, 
    createFormOutputModel, 
    listFormsInputModel, 
    listFormsOutputModel,
    getFormByIdInputModel,
    getFormByIdOutputModel,
    createFieldInputModel,
    createFieldOutputModel,
    updateFieldInputModel,
    updateFieldOutputModel,
    deleteFieldInputModel,
    deleteFieldOutputModel,
    getFieldsInputModel,
    getFieldsOutputModel,
    createFormSubmissionInputModel,
    createFormSubmissionOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
    createForm: authenticatedProcedure.meta({openapi :{
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect : true,
    }}).input(createFormInputModel).output(createFormOutputModel)
    .mutation(async ({input, ctx})=>{
        const {title, description} = input
        const {id, title: formTitle, description: formDescription, createdAt} = await formService.createForm({
            title,
            description,
            createdBy: ctx.user.id,
        })

        return {
            id
        }
    }),

    listForms: authenticatedProcedure.meta({openapi :{
        method: "GET",
        path: getPath("/listForms"),
        tags: TAGS,
        protect : true,
    }}).input(listFormsInputModel).output(listFormsOutputModel)
    .query(async ({ctx})=>{
        const forms = await formService.listFormsByUserId({
            userId: ctx.user.id,
        })

        return forms
    }),

    getFormById: publicProcedure.meta({openapi :{
        method: "GET",
        path: getPath("/getFormById"),
        tags: TAGS,
        protect : false,
    }}).input(getFormByIdInputModel).output(getFormByIdOutputModel)
    .query(async ({input})=>{
        const form = await formService.getFormById(input)
        return form
    }),

    createField: authenticatedProcedure.meta({openapi :{
        method: "POST",
        path: getPath("/createField"),
        tags: TAGS,
        protect : true,
    }}).input(createFieldInputModel).output(createFieldOutputModel)
    .mutation(async ({input})=>{
        const field = await formFieldService.createField(input)
        return field
    }),

    updateField: authenticatedProcedure.meta({openapi :{
        method: "PUT",
        path: getPath("/updateField"),
        tags: TAGS,
        protect : true,
    }}).input(updateFieldInputModel).output(updateFieldOutputModel)
    .mutation(async ({input})=>{
        const field = await formFieldService.updateField(input)
        return field
    }),

    deleteField: authenticatedProcedure.meta({openapi :{
        method: "DELETE",
        path: getPath("/deleteField"),
        tags: TAGS,
        protect : true,
    }}).input(deleteFieldInputModel).output(deleteFieldOutputModel)
    .mutation(async ({input})=>{
        const result = await formFieldService.deleteField(input)
        return result
    }),

    getFields: authenticatedProcedure.meta({openapi :{
        method: "GET",
        path: getPath("/getFields"),
        tags: TAGS,
        protect : true,
    }}).input(getFieldsInputModel).output(getFieldsOutputModel)
    .query(async ({input})=>{
        const fields = await formFieldService.getFields(input)
        return fields
    }),

    submitForm: publicProcedure.meta({openapi :{
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
        protect : false,
    }}).input(createFormSubmissionInputModel).output(createFormSubmissionOutputModel)
    .mutation(async ({input})=>{
        const submission = await formSubmissionService.createSubmission(input)
        return submission
    }),
})