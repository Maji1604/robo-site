import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, jsonb, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { departments } from "./departments";
import { institutions } from "./institution";

export const classes = pgTable("classes", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  grade: varchar("grade", { length: 50 }).notNull(), // New field for grade
  section: varchar("section", { length: 50 }).notNull(), // New field for section
  institutionId: uuid("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "cascade",
  }),
  studentIds: jsonb("student_ids").$type<string[]>().notNull().default([]),
  teacherIds: jsonb("teacher_ids").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Class = InferSelectModel<typeof classes>;
export type NewClass = InferInsertModel<typeof classes>;
