import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { sql } from "drizzle-orm";

type InstitutionType = "college" | "school";
type ContactDetails = {
  inchargePerson: string;
  mobileNumber: string;
  email?: string;
  officePhone?: string;
};

export const institutions = pgTable(
  "institutions",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: varchar("name", { length: 100 }).notNull().unique(),
    type: text("type")
      .$type<InstitutionType>()
      .notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    contactDetails: jsonb("contact_details").$type<ContactDetails>().notNull(),
    adminIds: jsonb("admin_ids").$type<string[]>().notNull().default([]),
    staffIds: jsonb("staff_ids").$type<string[]>().notNull().default([]),
    isActive: boolean("is_active").notNull().default(true),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    typeCheck: sql`CHECK (type IN ('college', 'school'))`,
  })
);

export type Institution = InferSelectModel<typeof institutions>;
export type NewInstitution = InferInsertModel<typeof institutions>;