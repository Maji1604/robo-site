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


// Admin roles type
// type AdminRoles = "super_admin" | "admin";

// Admin table
export const admin = pgTable("admin", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
    email: varchar("email", { length: 100 }).notNull().unique(),
    mobileNumber: varchar("mobile_number", { length: 10 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  lastIp: varchar("last_ip", { length: 45 }),
  lastUserAgent: varchar("last_user_agent", { length: 255 }),
  name: varchar("name", { length: 100 }),
  role: text("role").$type<AdminRoles>().notNull().default("admin"),
  institutionId: uuid("institution_id")  // Consistent naming
  .references(() => institutions.id, { onDelete: "restrict" }),
  isActive: boolean("is_active").notNull().default(true),
  isDeleted: boolean("is_delete").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});


// Types for admin table
export type Admin = InferSelectModel<typeof admin>;
export type NewAdmin = InferInsertModel<typeof admin>;
export type AdminInsert = InferInsertModel<typeof admin>;
export type AdminSelect = InferSelectModel<typeof admin>;
export type AdminRoles = "super_admin" | "admin";