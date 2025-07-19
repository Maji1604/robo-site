import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { institutions } from "./institution";

type StaffType = "teacher" | "clerk" | "librarian" | "other" | string;

export const staffs = pgTable("staffs", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  type: text("type").$type<StaffType>().notNull().default("other"),
  institutionId: uuid("institution_id")
    .notNull()
    .references(() => institutions.id, { onDelete: "restrict" }),
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
// CREATE INDEX idx_staffs_institution_id ON staffs (institution_id);

export type Staff = InferSelectModel<typeof staffs>;
export type NewStaff = InferInsertModel<typeof staffs>;