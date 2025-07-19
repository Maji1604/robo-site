import { db } from "@/db";
import { admin, institutions } from "@/db/schema";
import { PasetoUtil } from "@/shared/utils/paseto";
import { hashPassword, verifyPassword } from "@/shared/utils/password";
import Elysia, { t } from "elysia";
import { v7 as uuidv7 } from "uuid";
import { eq, or, and, desc, asc, like, ilike,count, isNotNull } from "drizzle-orm";
import { adminAuthMacro } from "../admin-macro";

export const adminController = new Elysia({
  prefix: "/admin",
  tags: ["Admin CRUD"],
})
  .use(adminAuthMacro)

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

        // Validate institutionId format and existence
        if (institutionId) {
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(institutionId);
          if (!isValidUUID) {
            set.status = 400;
            return {
              message: `Institution ID must be a valid UUID, got: ${institutionId}`,
            };
          }
          const institute = await db.query.institutions.findFirst({
            where: eq(institutions.id, institutionId),
          });
          if (!institute) {
            set.status = 400;
            return {
              message: `Institution ID does not exist: ${institutionId}`,
            };
          }
        }

        const offset = (page - 1) * limit;

        // Base condition for non-deleted admins
        let condition = eq(admin.isDeleted, false);

        // Apply institutionId filter if provided
        if (institutionId) {
          condition = and(condition, eq(admin.institutionId, institutionId));
        } else {
          // Exclude super_admins (with null institutionId) unless explicitly requested
          condition = and(condition, isNotNull(admin.institutionId));
        }

        // If search is present, add ilike condition on name
        if (search) {
          condition = and(
            condition,
            ilike(admin.name, `%${search.toLowerCase()}%`)
          );
        }

        console.log("Executing query with:", { search, institutionId, page, limit, condition });

        const [allAdmins, totalItems] = await Promise.all([
          db.query.admin.findMany({
            where: condition,
            limit,
            offset,
            orderBy: asc(admin.name),
            columns: {
              id: true,
              email: true,
              mobileNumber: true,
              name: true,
              role: true,
              institutionId: true,
              isActive: true,
              isDeleted: true,
              createdAt: true,
              updatedAt: true,
            },
          }),
          db.select({ count: count() }).from(admin).where(condition),
        ]);

        const totalCount = totalItems[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        if (allAdmins.length === 0) {
          return {
            message: search
              ? `No admins found matching search term: ${search} for institution: ${institutionId || 'any'}`
              : `No admins found for institution: ${institutionId || 'any'}`,
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
          message: "Admins retrieved successfully",
          data: allAdmins,
          pagination: {
            totalItems: totalCount,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
          },
        };
      } catch (error) {
        console.error("Error retrieving admins:", error);
        set.status = 500;
        return {
          message: "Failed to retrieve admins",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      query: t.Object({
        search: t.Optional(t.String()),
        page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
        limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
        institutionId: t.Optional(t.String({ pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$" })),
      }),
      detail: {
        summary: "Get all admins",
        description: "Retrieve a list of all active (non-deleted) admins with optional search, pagination, and institution ID filtering. Only admins matching the provided institutionId are returned.",
      },
    }
  )
  
  .get(
    "/:id",
    async ({ params, set }) => {
      try {
        const { id } = params;

        const foundAdmin = await db
          .select({
            id: admin.id,
            email: admin.email,
            mobileNumber: admin.mobileNumber,
            name: admin.name,
            role: admin.role,
            institutionId: admin.institutionId,
            isActive: admin.isActive,
            lastLogin: admin.lastLogin,
            lastIp: admin.lastIp,
            lastUserAgent: admin.lastUserAgent,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
            school: {
              id: institutions.id,
              name: institutions.name,
            },
          })
          .from(admin)
          .leftJoin(institutions, eq(admin.institutionId, institutions.id))
          .where(and(eq(admin.id, id), eq(admin.isDeleted, false)))
          .limit(1);

        if (!foundAdmin.length) {
          set.status = 404;
          return {
            message: "Admin not found",
          };
        }

        set.status = 200;
        return {
          message: "Admin retrieved successfully",
          data: foundAdmin[0],
        };
      } catch (error) {
        console.error("Error fetching admin:", error);
        set.status = 500;
        return {
          message: "Failed to fetch admin",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get admin by ID",
        description: "Retrieve a specific admin by their UUID",
      },
    }
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const { id } = params;
        const { email, mobileNumber, name, role, institutionId, password, isActive } = body;

        // Check if admin exists and is not deleted
        const existingAdmin = await db.query.admin.findFirst({
          where: and(eq(admin.id, id), eq(admin.isDeleted, false)),
        });

        if (!existingAdmin) {
          set.status = 404;
          return {
            message: "Admin not found",
          };
        }

        // Validate required fields if provided
        if (email && email.length > 45) {
          set.status = 400;
          return {
            message: "Email must be 45 characters or less",
          };
        }

        if (name && name.length > 45) {
          set.status = 400;
          return {
            message: "Name must be 45 characters or less",
          };
        }

        if (mobileNumber && (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber))) {
          set.status = 400;
          return {
            message: "Mobile number must be a 10-digit number",
          };
        }

        if (password && password.length < 8) {
          set.status = 400;
          return {
            message: "Password must be at least 8 characters long",
          };
        }

        // Validate role if provided
        if (role && !["super_admin", "admin"].includes(role)) {
          set.status = 400;
          return {
            message: "Invalid role. Must be 'super_admin' or 'admin'",
          };
        }

        // Validate institutionId
        if (role === "admin" && institutionId === undefined) {
          set.status = 400;
          return {
            message: "School ID is required for admin role",
          };
        }
        if (role === "super_admin" && institutionId) {
          set.status = 400;
          return {
            message: "School ID must be null for super_admin role",
          };
        }

        // Validate institutionId format and existence
        if (role === "admin" && institutionId) {
            const institute = await db.query.institutions.findFirst({
              where: eq(institutions.id, institutionId),
            });
          if (!institute) {
            set.status = 400;
            return {
              message: "Invalid institute ID",
            };
          }
        }

        // Check for email conflict
        if (email && email !== existingAdmin.email) {
          const emailExists = await db.query.admin.findFirst({
            where: and(eq(admin.email, email), eq(admin.isDeleted, false)),
          });
          if (emailExists) {
            set.status = 409;
            return {
              message: "Email already exists",
            };
          }
        }

        // Check for mobile number conflict
        if (mobileNumber && mobileNumber !== existingAdmin.mobileNumber) {
          const mobileExists = await db.query.admin.findFirst({
            where: and(eq(admin.mobileNumber, mobileNumber), eq(admin.isDeleted, false)),
          });
          if (mobileExists) {
            set.status = 409;
            return {
              message: "Mobile number already exists",
            };
          }
        }

        // Prepare update data
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (email) updateData.email = email;
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
        if (name !== undefined) updateData.name = name;
        if (role) updateData.role = role;
        if (institutionId !== undefined) updateData.institutionId = role === "admin" ? institutionId : null;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password) updateData.passwordHash = await hashPassword(password);

        // Update admin
        const [updatedAdmin] = await db
          .update(admin)
          .set(updateData)
          .where(eq(admin.id, id))
          .returning({
            id: admin.id,
            email: admin.email,
            mobileNumber: admin.mobileNumber,
            name: admin.name,
            role: admin.role,
            institutionId: admin.institutionId,
            isActive: admin.isActive,
            updatedAt: admin.updatedAt,
            createdAt: admin.createdAt,
          });

        set.status = 200;
        return {
          message: "Admin updated successfully",
          data: updatedAdmin,
        };
      } catch (error) {
        console.error("Error updating admin:", error);
        set.status = 500;
        return {
          message: "Failed to update admin",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        email: t.Optional(t.String({ format: "email", maxLength: 45 })),
        mobileNumber: t.Optional(t.String({ pattern: "^\\d{10}$", minLength: 10, maxLength: 10 })),
        name: t.Optional(t.String({ minLength: 1, maxLength: 45 })),
        role: t.Optional(t.Enum({ super_admin: "super_admin", admin: "admin" })),
        institutionId: t.Optional(t.String({ format: "uuid" })),
        password: t.Optional(t.String({ minLength: 8 })),
        isActive: t.Optional(t.Boolean()),
      }),
      detail: {
        summary: "Update admin",
        description: "Update an existing admin with optional fields",
      },
    }
  )
  .patch(
    "/:id/toggle-status",
    async ({ params, set }) => {
      try {
        const { id } = params;

        // Check if admin exists and is not deleted
        const existingAdmin = await db.query.admin.findFirst({
          where: and(eq(admin.id, id), eq(admin.isDeleted, false)),
        });

        if (!existingAdmin) {
          set.status = 404;
          return {
            message: "Admin not found",
          };
        }

        // Toggle active status
        const updatedAdmin = await db
          .update(admin)
          .set({
            isActive: !existingAdmin.isActive,
            updatedAt: new Date(),
          })
          .where(eq(admin.id, id))
          .returning({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            isActive: admin.isActive,
            updatedAt: admin.updatedAt,
          });

        set.status = 200;
        return {
          message: `Admin ${updatedAdmin[0].isActive ? 'activated' : 'deactivated'} successfully`,
          data: updatedAdmin[0],
        };
      } catch (error) {
        console.error("Error toggling admin status:", error);
        set.status = 500;
        return {
          message: "Failed to toggle admin status",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Toggle admin active status",
        description: "Toggle the active/inactive status of an admin",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      try {
        const { id } = params;

        // Check if admin exists and is not already deleted
        const existingAdmin = await db.query.admin.findFirst({
          where: and(eq(admin.id, id), eq(admin.isDeleted, false)),
        });

        if (!existingAdmin) {
          set.status = 404;
          return {
            message: "Admin not found",
          };
        }

        // Soft delete admin
        await db
          .update(admin)
          .set({
            isDeleted: true,
            isActive: false,
            updatedAt: new Date(),
          })
          .where(eq(admin.id, id));

        set.status = 200;
        return {
          message: "Admin deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting admin:", error);
        set.status = 500;
        return {
          message: "Failed to delete admin",
        };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Soft delete admin",
        description: "Soft delete an admin (mark as deleted and inactive)",
      },
    }
  );