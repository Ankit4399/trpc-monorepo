import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum", [
    "text",
    "number",
    "email",
    "yes_no",
    "password",   
]);

export const formFieldsTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id).notNull(),

  label: varchar("label", { length: 100 }).notNull(),
  labelKey: varchar("label_key", { length: 100 }).notNull(),

  placeholder: text("placeholder"),
  isRequired: boolean("is_required").default(false).notNull(),
  index: numeric("index", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),

    type: fieldTypeEnum("type").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
},(table)=>{
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})