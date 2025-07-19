import { db } from "@/db";
import { departments, institutions } from "@/db/schema";
import Elysia, { t } from "elysia";
import { eq, ilike, and, count, asc } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { adminAuthMacro } from "../admin-macro";

export const departmentController = new Elysia({
  prefix: "/departments",
  tags: ["Departments"],
})
  .use(adminAuthMacro)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, institutionId } = body;

        // Validate required fields
        if (!name || !institutionId) {
          set.status = 400;
          return { message: "Name and institutionId are required" };
        }

        // Validate field lengths
        if (name.length > 100) {
          set.status = 400;
          return { message: "Name must be 100 characters or less" };
        }

        // Check if institution exists and is of type 'college'
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!institution || institution.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        if (institution.type !== "college") {
          set.status = 400;
          return { message: "Departments can only be created for colleges" };
        }

        // Check for existing department name within the institution
        const existing = await db.query.departments.findFirst({
          where: and(eq(departments.name, name), eq(departments.institutionId, institutionId)),
        });

        if (existing) {
          set.status = 409;
          return { message: "Department name already exists in this institution" };
        }

        // Insert new department
        const [newDepartment] = await db
          .insert(departments)
          .values({
            id: uuidv7(),
            name,
            institutionId,
            isActive: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        set.status = 201;
        return {
          message: "Department created successfully",
          data: newDepartment,
        };
      } catch (error) {
        console.error("Error creating department:", error);
        set.status = 500;
        return { message: "Failed to create department" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        institutionId: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Create a new department",
        description: "Create a new department for a college with name and institution ID.",
      },
    }
  )
  .get(
    "/",
    async ({ query, set }) => {
      try {
        const { search, institutionId, page = 1, limit = 10 } = query;

        // Validate inputs
        if (page < 1) {
          set.status = 400;
          return { message: "Page must be at least 1" };
        }

        if (limit < 1 || limit > 100) {
          set.status = 400;
          return { message: "Limit must be between 1 and 100" };
        }

        if (institutionId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(institutionId)) {
          set.status = 400;
          return { message: "Invalid institutionId format" };
        }

        const offset = (page - 1) * limit;

        // Build the base query
        const baseWhere = and(
          eq(departments.isDeleted, false),
          institutionId ? eq(departments.institutionId, institutionId) : undefined
        );

        // Add search condition if search term exists
        const searchCondition = search
          ? and(baseWhere, ilike(departments.name, `%${search.toLowerCase()}%`))
          : baseWhere;

        // Execute both queries in parallel
        const [allDepartments, totalItems] = await Promise.all([
          db.query.departments.findMany({
            where: searchCondition,
            limit: limit,
            offset: offset,
            orderBy: asc(departments.name),
          }),
          db.select({ count: count() }).from(departments).where(searchCondition),
        ]);

        const totalCount = totalItems[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        // Handle empty results case
        if (allDepartments.length === 0) {
          return {
            message: search
              ? `No departments found matching search term: ${search}`
              : "No departments found in the database",
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
          message: "Departments retrieved successfully",
          data: allDepartments,
          pagination: {
            totalItems: totalCount,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
          },
        };
      } catch (error) {
        console.error("Error retrieving departments:", error);
        set.status = 500;
        return { message: "Failed to retrieve departments" };
      }
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        institutionId: t.Optional(t.String({ format: "uuid" })),
        page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
        limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
      }),
      detail: {
        summary: "Get all departments",
        description: "Retrieve a list of all active (non-deleted) departments with optional search, institution filter, and pagination.",
      },
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const department = await db.query.departments.findFirst({
          where: eq(departments.id, id),
        });

        if (!department || department.isDeleted) {
          set.status = 404;
          return { message: "Department not found" };
        }

        set.status = 200;
        return {
          message: "Department retrieved successfully",
          data: department,
        };
      } catch (error) {
        console.error("Error retrieving department:", error);
        set.status = 500;
        return { message: "Failed to retrieve department" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get department by ID",
        description: "Retrieve a specific department by its UUID.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const { name, institutionId } = body;

        // Validate required fields
        if (!name || !institutionId) {
          set.status = 400;
          return { message: "Name and institutionId are required" };
        }

        // Validate field lengths
        if (name.length > 100) {
          set.status = 400;
          return { message: "Name must be 100 characters or less" };
        }

        // Check if department exists
        const existing = await db.query.departments.findFirst({
          where: eq(departments.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Department not found" };
        }

        // Check if institution exists and is of type 'college'
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!institution || institution.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        if (institution.type !== "college") {
          set.status = 400;
          return { message: "Departments can only belong to colleges" };
        }

        // Check for name conflict
        const nameConflict = await db.query.departments.findFirst({
          where: and(eq(departments.name, name), eq(departments.institutionId, institutionId)),
        });

        if (nameConflict && nameConflict.id !== id) {
          set.status = 409;
          return { message: "Department name already exists in this institution" };
        }

        // Update department
        const [updatedDepartment] = await db
          .update(departments)
          .set({
            name,
            institutionId,
            updatedAt: new Date(),
          })
          .where(eq(departments.id, id))
          .returning();

        set.status = 200;
        return {
          message: "Department updated successfully",
          data: updatedDepartment,
        };
      } catch (error) {
        console.error("Error updating department:", error);
        set.status = 500;
        return { message: "Failed to update department" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        institutionId: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Update a department",
        description: "Update an existing department by its UUID.",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const existing = await db.query.departments.findFirst({
          where: eq(departments.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Department not found" };
        }

        // Soft delete department
        await db
          .update(departments)
          .set({ isDeleted: true, updatedAt: new Date() })
          .where(eq(departments.id, id));

        set.status = 200;
        return { message: "Department deleted successfully" };
      } catch (error) {
        console.error("Error deleting department:", error);
        set.status = 500;
        return { message: "Failed to delete department" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Delete a department",
        description: "Soft delete a department by setting isDeleted to true.",
      },
    }
  );