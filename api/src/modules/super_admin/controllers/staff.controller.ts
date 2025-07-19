import { db } from "@/db";
import { staffs, institutions } from "@/db/schema";
import { eq, and, desc, asc, like, ilike, count, isNotNull } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { v7 as uuidv7 } from "uuid";// Assuming you have a similar auth macro for staff
import { adminAuthMacro } from "../admin-macro";

export const staffController = new Elysia({
  prefix: "/staff",
  tags: ["Staff CRUD"],
})
.use(adminAuthMacro)

  // Create a new staff member
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, email, type, institutionId } = body;

        // Validate inputs
        if (!name || !email || !type || !institutionId) {
          set.status = 400;
          return { message: "Missing required fields" };
        }

        // Check if institution exists
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!institution) {
          set.status = 400;
          return { message: "Institution does not exist" };
        }

        // Create staff
        const [newStaff] = await db
          .insert(staffs)
          .values({
            name,
            email,
            type,
            institutionId,
          })
          .returning();

        // Update institution with new staff ID
        await db
          .update(institutions)
          .set({
            staffIds: [...institution.staffIds, newStaff.id],
          })
          .where(eq(institutions.id, institutionId));

        set.status = 201;
        return {
          message: "Staff created successfully",
          data: newStaff,
        };
      } catch (error) {
        console.error("Error creating staff:", error);
        set.status = 500;
        return {
          message: "Failed to create staff",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      body: t.Object({
        name: t.String({ maxLength: 100 }),
        email: t.String({ format: "email", maxLength: 100 }),
        type: t.String(),
        institutionId: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Create a new staff member",
        description: "Create a new staff member and update the institution with the staff ID",
      },
    }
  )

  // Get all staff members
  .get(
    "/",
    async ({ query, set }) => {
      try {
        const { search, page = 1, limit = 10, institutionId } = query;

        // Validate inputs
        if (page < 1) {
          set.status = 400;
          return { message: "Page must be at least 1" };
        }

        if (limit < 1 || limit > 100) {
          set.status = 400;
          return { message: "Limit must be between 1 and 100" };
        }

        const offset = (page - 1) * limit;

        // Base condition for non-deleted staff
        let condition = eq(staffs.isDeleted, false);

        // Apply institutionId filter if provided
        if (institutionId) {
          condition = and(condition, eq(staffs.institutionId, institutionId));
        }

        // If search is present, add ilike condition on name
        if (search) {
          condition = and(
            condition,
            ilike(staffs.name, `%${search.toLowerCase()}%`)
          );
        }

        const [allStaffs, totalItems] = await Promise.all([
          db.query.staffs.findMany({
            where: condition,
            limit,
            offset,
            orderBy: asc(staffs.name),
          }),
          db.select({ count: count() }).from(staffs).where(condition),
        ]);

        const totalCount = totalItems[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        if (allStaffs.length === 0) {
          return {
            message: search
              ? `No staffs found matching search term: ${search} for institution: ${institutionId || 'any'}`
              : `No staffs found for institution: ${institutionId || 'any'}`,
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
          message: "Staffs retrieved successfully",
          data: allStaffs,
          pagination: {
            totalItems: totalCount,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
          },
        };
      } catch (error) {
        console.error("Error retrieving staffs:", error);
        set.status = 500;
        return {
          message: "Failed to retrieve staffs",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
        limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
        institutionId: t.Optional(t.String({ format: "uuid" })),
      }),
      detail: {
        summary: "Get all staff members",
        description: "Retrieve a list of all active (non-deleted) staff members with optional search, pagination, and institution ID filtering",
      },
    }
  )

  // Get a specific staff member by ID
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const { id } = params;

        const foundStaff = await db.query.staffs.findFirst({
          where: and(eq(staffs.id, id), eq(staffs.isDeleted, false)),
        });

        if (!foundStaff) {
          set.status = 404;
          return {
            message: "Staff not found",
          };
        }

        set.status = 200;
        return {
          message: "Staff retrieved successfully",
          data: foundStaff,
        };
      } catch (error) {
        console.error("Error fetching staff:", error);
        set.status = 500;
        return {
          message: "Failed to fetch staff",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get staff by ID",
        description: "Retrieve a specific staff member by their UUID",
      },
    }
  )

  // Update a staff member
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const { id } = params;
        const { name, email, type, institutionId, isActive } = body;

        // Check if staff exists and is not deleted
        const existingStaff = await db.query.staffs.findFirst({
          where: and(eq(staffs.id, id), eq(staffs.isDeleted, false)),
        });

        if (!existingStaff) {
          set.status = 404;
          return {
            message: "Staff not found",
          };
        }

        // Validate inputs
        if (name && name.length > 100) {
          set.status = 400;
          return {
            message: "Name must be 100 characters or less",
          };
        }

        if (email && email.length > 100) {
          set.status = 400;
          return {
            message: "Email must be 100 characters or less",
          };
        }

        // Prepare update data
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (type) updateData.type = type;
        if (institutionId) updateData.institutionId = institutionId;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Update staff
        const [updatedStaff] = await db
          .update(staffs)
          .set(updateData)
          .where(eq(staffs.id, id))
          .returning();

        set.status = 200;
        return {
          message: "Staff updated successfully",
          data: updatedStaff,
        };
      } catch (error) {
        console.error("Error updating staff:", error);
        set.status = 500;
        return {
          message: "Failed to update staff",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        name: t.Optional(t.String({ maxLength: 100 })),
        email: t.Optional(t.String({ format: "email", maxLength: 100 })),
        type: t.Optional(t.String()),
        institutionId: t.Optional(t.String({ format: "uuid" })),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "Update staff",
        description: "Update an existing staff member with optional fields",
      },
    }
  )

  // Toggle staff active status
  .patch(
    "/:id/toggle-status",
    async ({ params, set }) => {
      try {
        const { id } = params;

        // Check if staff exists and is not deleted
        const existingStaff = await db.query.staffs.findFirst({
          where: and(eq(staffs.id, id), eq(staffs.isDeleted, false)),
        });

        if (!existingStaff) {
          set.status = 404;
          return {
            message: "Staff not found",
          };
        }

        // Toggle active status
        const updatedStaff = await db
          .update(staffs)
          .set({
            isActive: !existingStaff.isActive,
            updatedAt: new Date(),
          })
          .where(eq(staffs.id, id))
          .returning();

        set.status = 200;
        return {
          message: `Staff ${updatedStaff[0].isActive ? 'activated' : 'deactivated'} successfully`,
          data: updatedStaff[0],
        };
      } catch (error) {
        console.error("Error toggling staff status:", error);
        set.status = 500;
        return {
          message: "Failed to toggle staff status",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Toggle staff active status",
        description: "Toggle the active/inactive status of a staff member",
      },
    }
  )

  // Soft delete a staff member
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        const { id } = params;

        // Check if staff exists and is not already deleted
        const existingStaff = await db.query.staffs.findFirst({
          where: and(eq(staffs.id, id), eq(staffs.isDeleted, false)),
        });

        if (!existingStaff) {
          set.status = 404;
          return {
            message: "Staff not found",
          };
        }

        // Soft delete staff
        await db
          .update(staffs)
          .set({
            isDeleted: true,
            isActive: false,
            updatedAt: new Date(),
          })
          .where(eq(staffs.id, id));

        set.status = 200;
        return {
          message: "Staff deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting staff:", error);
        set.status = 500;
        return {
          message: "Failed to delete staff",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Soft delete staff",
        description: "Soft delete a staff member (mark as deleted and inactive)",
      },
    }
  );
