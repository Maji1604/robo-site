import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { classes } from "./classes";
import { institutions } from "./institution";

export const students = pgTable("students", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 100 }).notNull(),
  classId: uuid("class_id")
    .notNull()
    .references(() => classes.id, { onDelete: "restrict" }),
    institutionId: uuid("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "cascade" }),
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

// Note: Apply index via migration for performance
// CREATE INDEX idx_students_class_id ON students (class_id);

export type Student = InferSelectModel<typeof students>;
export type NewStudent = InferInsertModel<typeof students>;