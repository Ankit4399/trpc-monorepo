import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  json,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formsTable } from "./form";
import { formFieldsTable } from "./form-field";

export interface FormSubmissionValue{
    formFieldId: string,
    value : string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionsTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id").references(() => formsTable.id).notNull(),
  
  values : json('values').$type<FormSubmissionValueRow>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})