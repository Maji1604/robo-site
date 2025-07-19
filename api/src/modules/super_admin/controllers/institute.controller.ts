import { db } from "@/db";
import { institutions } from "@/db/schema";
import Elysia, { t } from "elysia";
import { eq, or, ilike, count, asc, and } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { adminAuthMacro } from "../admin-macro";

export const institutionController = new Elysia({
  prefix: "/institutions",
  tags: ["Institutions"],
})
  .use(adminAuthMacro)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, type, address, contactDetails } = body;

        // Validate required fields
        if (!name || !type || !address || !contactDetails.inchargePerson || !contactDetails.mobileNumber) {
          set.status = 400;
          return { message: "Name, type, address, incharge person, and mobile number are required" };
        }

        // Validate field lengths
        if (name.length > 100) {
          set.status = 400;
          return { message: "Name must be 100 characters or less" };
        }

        // Validate type
        if (!["college", "school"].includes(type)) {
          set.status = 400;
          return { message: "Type must be 'college' or 'school'" };
        }

        // Validate email if provided
        if (contactDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
          set.status = 400;
          return { message: "Invalid email format" };
        }

        // Validate mobileNumber format
        if (!/^\d{10}$/.test(contactDetails.mobileNumber)) {
          set.status = 400;
          return { message: "Mobile number must be a 10-digit number" };
        }

        // Check for existing name
        const existing = await db.query.institutions.findFirst({
          where: eq(institutions.name, name),
        });

        if (existing) {
          set.status = 409;
          return { message: "Institution name already exists" };
        }

        // Insert new institution
        const [newInstitution] = await db
          .insert(institutions)
          .values({
            id: uuidv7(),
            name,
            type,
            address,
            contactDetails,
            adminIds: [],
            staffIds: [],
            isActive: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        set.status = 201;
        return {
          message: "Institution created successfully",
          data: newInstitution,
        };
      } catch (error) {
        console.error("Error creating institution:", error);
        set.status = 500;
        return { message: "Failed to create institution" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        type: t.Enum({ college: "college", school: "school" }),
        address: t.String({ minLength: 1 }),
        contactDetails: t.Object({
          inchargePerson: t.String({ minLength: 1 }),
          mobileNumber: t.String({ pattern: "^\\d{10}$" }),
          email: t.Optional(t.String({ format: "email" })),
          officePhone: t.Optional(t.String()),
        }),
      }),
      detail: {
        summary: "Create a new institution",
        description: "Create a new institution with name, type, address, and contact details.",
      },
    }
  )
  .get(
    "/",
    async ({ query, set }) => {
      try {
        const { search, page = 1, limit = 10 } = query;
  
        console.log("Query parameters:", { search, page, limit }); // Log the incoming query parameters
  
        if (page < 1) {
          set.status = 400;
          return { message: "Page must be at least 1" };
        }
  
        if (limit < 1 || limit > 100) {
          set.status = 400;
          return { message: "Limit must be between 1 and 100" };
        }
  
        const offset = (page - 1) * limit;
  
        const baseWhere = eq(institutions.isDeleted, false);
  
        const searchCondition = search
          ? and(baseWhere, ilike(institutions.name, `%${search.toLowerCase()}%`))
          : baseWhere;
  
        console.log("Search condition:", searchCondition); // Log the search condition
  
        const [allInstitutions, totalItems] = await Promise.all([
          db.query.institutions.findMany({
            where: searchCondition,
            limit: limit,
            offset: offset,
            orderBy: asc(institutions.name),
          }),
          db.select({ count: count() }).from(institutions).where(searchCondition),
        ]);
  
        console.log("Institutions retrieved:", allInstitutions); // Log the retrieved institutions
        console.log("Total items count:", totalItems); // Log the total count
  
        const totalCount = totalItems[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);
  
        if (allInstitutions.length === 0) {
          return {
            message: search
              ? `No institutions found matching search term: ${search}`
              : "No institutions found in the database",
            data: [],
            pagination: {
              totalItems: 0,
              totalPages: 0,
              currentPage: page,
              itemsPerPage: limit,
            },
          };
        }
  
        set.status = 200;
        return {
          message: "Institutions retrieved successfully",
          data: allInstitutions,
          pagination: {
            totalItems: totalCount,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
          },
        };
      } catch (error) {
        console.error("Error retrieving institutions:", error);
        set.status = 500;
        return { message: "Failed to retrieve institutions" };
      }
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
        limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Get all institutions",
        description: "Retrieve a list of all active (non-deleted) institutions with optional search and pagination.",
      },
    }
  )
  
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, id),
        });

        if (!institution || institution.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        set.status = 200;
        return {
          message: "Institution retrieved successfully",
          data: institution,
        };
      } catch (error) {
        console.error("Error retrieving institution:", error);
        set.status = 500;
        return { message: "Failed to retrieve institution" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get institution by ID",
        description: "Retrieve a specific institution by its UUID.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const { name, type, address, contactDetails } = body;

        // Validate required fields
        if (!name || !type || !address || !contactDetails.inchargePerson || !contactDetails.mobileNumber) {
          set.status = 400;
          return { message: "Name, type, address, incharge person, and mobile number are required" };
        }

        // Validate field lengths
        if (name.length > 100) {
          set.status = 400;
          return { message: "Name must be 100 characters or less" };
        }

        // Validate type
        if (!["college", "school"].includes(type)) {
          set.status = 400;
          return { message: "Type must be 'college' or 'school'" };
        }

        // Validate email if provided
        if (contactDetails.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
          set.status = 400;
          return { message: "Invalid email format" };
        }

        // Validate mobileNumber format
        if (!/^\d{10}$/.test(contactDetails.mobileNumber)) {
          set.status = 400;
          return { message: "Mobile number must be a 10-digit number" };
        }

        // Check if institution exists
        const existing = await db.query.institutions.findFirst({
          where: eq(institutions.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        // Check for name conflict
        const nameConflict = await db.query.institutions.findFirst({
          where: eq(institutions.name, name),
        });

        if (nameConflict && nameConflict.id !== id) {
          set.status = 409;
          return { message: "Institution name already exists" };
        }

        // Update institution
        const [updatedInstitution] = await db
          .update(institutions)
          .set({
            name,
            type,
            address,
            contactDetails,
            updatedAt: new Date(),
          })
          .where(eq(institutions.id, id))
          .returning();

        set.status = 200;
        return {
          message: "Institution updated successfully",
          data: updatedInstitution,
        };
      } catch (error) {
        console.error("Error updating institution:", error);
        set.status = 500;
        return { message: "Failed to update institution" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        type: t.Enum({ college: "college", school: "school" }),
        address: t.String({ minLength: 1 }),
        contactDetails: t.Object({
          inchargePerson: t.String({ minLength: 1 }),
          mobileNumber: t.String({ pattern: "^\\d{10}$" }),
          email: t.Optional(t.String({ format: "email" })),
          officePhone: t.Optional(t.String()),
        }),
      }),
      detail: {
        summary: "Update an institution",
        description: "Update an existing institution by its UUID.",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const existing = await db.query.institutions.findFirst({
          where: eq(institutions.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        await db
          .update(institutions)
          .set({ isDeleted: true, updatedAt: new Date() })
          .where(eq(institutions.id, id));

        set.status = 200;
        return { message: "Institution deleted successfully" };
      } catch (error) {
        console.error("Error deleting institution:", error);
        set.status = 500;
        return { message: "Failed to delete institution" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Delete an institution",
        description: "Soft delete an institution by setting isDeleted to true.",
      },
    }
  );