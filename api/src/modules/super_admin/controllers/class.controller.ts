import { db } from "@/db";
import { classes, institutions, departments } from "@/db/schema";
import Elysia, { t } from "elysia";
import { eq, ilike, and, count, asc } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { adminAuthMacro } from "../admin-macro";

export const classController = new Elysia({
  prefix: "/classes",
  tags: ["Classes"],
})
  .use(adminAuthMacro)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { grade, section, institutionId, departmentId } = body;

        // Validate required fields
        if ( !institutionId) {
          set.status = 400;
          return { message: "InstitutionId are required" };
        }


        // Validate institution
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!institution || institution.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        // Enforce departmentId for colleges, no departmentId for schools
        if (institution.type === "college" && !departmentId) {
          set.status = 400;
          return { message: "departmentId is required for colleges" };
        }
        if (institution.type === "school" && departmentId) {
          set.status = 400;
          return { message: "departmentId should not be provided for schools" };
        }

        // Validate department if provided
        if (departmentId) {
          const department = await db.query.departments.findFirst({
            where: eq(departments.id, departmentId),
          });

          if (!department || department.isDeleted) {
            set.status = 404;
            return { message: "Department not found" };
          }

          if (department.institutionId !== institutionId) {
            set.status = 400;
            return { message: "Department does not belong to the specified institution" };
          }
        }

        // Check for existing class name within the institution or department
        const existing = await db.query.classes.findFirst({
          where: and(
            eq(classes.institutionId, institutionId),
            ilike(classes.grade, grade ?? '') ,
            ilike(classes.section, section??''),
            departmentId ? eq(classes.departmentId, departmentId) : undefined
          ),
        });

        if (existing) {
          set.status = 409;
          return { message: "Class name already exists in this institution or department" };
        }

        // Insert new class
        const [newClass] = await db
          .insert(classes)
          .values({
            id: uuidv7(),
            grade,
            section,
            institutionId,
            departmentId,
            studentIds: [],
            teacherIds: [],
            isActive: true,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        set.status = 201;
        return {
          message: "Class created successfully",
          data: newClass,
        };
      } catch (error) {
        console.error("Error creating class:", error);
        set.status = 500;
        return { message: "Failed to create class" };
      }
    },
    {
      body: t.Object({
        grade: t.Optional(t.String({ maxLength: 50 })),
        section: t.Optional(t.String({ maxLength: 50 })),
        institutionId: t.String({ format: "uuid" }),
        departmentId: t.Optional(t.String({ format: "uuid" })),
      }),
      detail: {
        summary: "Create a new class",
        description: "Create a new class for a school (institutionId) or a college (institutionId and departmentId).",
      },
    }
  )
  .get("/", async ({ query, set }) => {
    try {
      const { search, institutionId, departmentId, page = 1, limit = 10 } = query;

      if (page < 1) {
        set.status = 400;
        return { message: "Page must be at least 1" };
      }

      if (limit < 1 || limit > 100) {
        set.status = 400;
        return { message: "Limit must be between 1 and 100" };
      }

      const offset = (page - 1) * limit;

      const baseWhere = and(
        eq(classes.isDeleted, false),
        institutionId ? eq(classes.institutionId, institutionId) : undefined,
        departmentId ? eq(classes.departmentId, departmentId) : undefined
      );

      const searchCondition = search
        ? and(baseWhere, ilike(classes.section, `%${search.toLowerCase()}%`))
        : baseWhere;

      const [allClasses, totalItems] = await Promise.all([
        db.query.classes.findMany({
          where: searchCondition,
          limit: limit,
          offset: offset
        }),
        db.select({ count: count() }).from(classes).where(searchCondition),
      ]);

      const totalCount = totalItems[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      if (allClasses.length === 0) {
        return {
          message: search
            ? `No classes found matching search term: ${search}`
            : "No classes found in the database",
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
        message: "Classes retrieved successfully",
        data: allClasses,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error:any) {
      console.error("Error retrieving classes:", error);
      set.status = 500;
      return { message: "Failed to retrieve classes", error: error.message };
    }
  }, {
    query: t.Object({
      search: t.Optional(t.String()),
      institutionId: t.Optional(t.String({ format: "uuid" })),
      departmentId: t.Optional(t.String({ format: "uuid" })),
      page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
      limit: t.Optional(t.Numeric({ default: 10, minimum: 1, maximum: 100 })),
    }),
  })
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const classData = await db.query.classes.findFirst({
          where: eq(classes.id, id),
        });

        if (!classData || classData.isDeleted) {
          set.status = 404;
          return { message: "Class not found" };
        }

        set.status = 200;
        return {
          message: "Class retrieved successfully",
          data: classData,
        };
      } catch (error) {
        console.error("Error retrieving class:", error);
        set.status = 500;
        return { message: "Failed to retrieve class" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get class by ID",
        description: "Retrieve a specific class by its UUID.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const { grade, section, institutionId, departmentId } = body;

        // Validate required fields
        if (!institutionId) {
          set.status = 400;
          return { message: "Name and institutionId are required" };
        }
        // Check if class exists
        const existing = await db.query.classes.findFirst({
          where: eq(classes.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Class not found" };
        }

        // Validate institution
        const institution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!institution || institution.isDeleted) {
          set.status = 404;
          return { message: "Institution not found" };
        }

        // Enforce departmentId for colleges, no departmentId for schools
        if (institution.type === "college" && !departmentId) {
          set.status = 400;
          return { message: "departmentId is required for colleges" };
        }
        if (institution.type === "school" && departmentId) {
          set.status = 400;
          return { message: "departmentId should not be provided for schools" };
        }

        // Validate department if provided
        if (departmentId) {
          const department = await db.query.departments.findFirst({
            where: eq(departments.id, departmentId),
          });

          if (!department || department.isDeleted) {
            set.status = 404;
            return { message: "Department not found" };
          }

          if (department.institutionId !== institutionId) {
            set.status = 400;
            return { message: "Department does not belong to the specified institution" };
          }
        }

        // Check for name conflict
        const nameConflict = await db.query.classes.findFirst({
          where: and(
            eq(classes.institutionId, institutionId),
            ilike(classes.grade, grade ?? '') ,
            ilike(classes.section, section??''),
            departmentId ? eq(classes.departmentId, departmentId) : undefined
          ),
        });

        if (nameConflict && nameConflict.id !== id) {
          set.status = 409;
          return { message: "Class name already exists in this institution or department" };
        }

        // Update class
        const [updatedClass] = await db
          .update(classes)
          .set({
            grade,
            section,
            institutionId,
            departmentId,
            updatedAt: new Date(),
          })
          .where(eq(classes.id, id))
          .returning();

        set.status = 200;
        return {
          message: "Class updated successfully",
          data: updatedClass,
        };
      } catch (error) {
        console.error("Error updating class:", error);
        set.status = 500;
        return { message: "Failed to update class" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        grade: t.Optional(t.String({ maxLength: 50 })),
        section: t.Optional(t.String({ maxLength: 50 })),
        institutionId: t.String({ format: "uuid" }),
        departmentId: t.Optional(t.String({ format: "uuid" })),
      }),
      detail: {
        summary: "Update a class",
        description: "Update an existing class by its UUID.",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const existing = await db.query.classes.findFirst({
          where: eq(classes.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Class not found" };
        }

        // Soft delete class
        await db
          .update(classes)
          .set({ isDeleted: true, updatedAt: new Date() })
          .where(eq(classes.id, id));

        set.status = 200;
        return { message: "Class deleted successfully" };
      } catch (error) {
        console.error("Error deleting class:", error);
        set.status = 500;
        return { message: "Failed to delete class" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Delete a class",
        description: "Soft delete a class by setting isDeleted to true.",
      },
    }
  )
  .patch(
    "/:id/toggle-status",
    async ({ params: { id }, body, set }) => {
      try {
        const { isActive } = body;

        const [updatedClass] = await db
          .update(classes)
          .set({
            isActive: !isActive,
            updatedAt: new Date(),
          })
          .where(eq(classes.id, id))
          .returning();

        if (!updatedClass) {
          set.status = 404;
          return { message: "Class not found" };
        }

        set.status = 200;
        return {
          message: "Class status updated successfully",
          data: updatedClass,
        };
      } catch (error) {
        console.error("Error updating class status:", error);
        set.status = 500;
        return { message: "Failed to update class status" };
      }
    },
    {
      body: t.Object({
        isActive: t.Boolean(),
      }),
      detail: {
        summary: "Toggle class status",
        description: "Toggle the active status of a class by its UUID.",
      },
    }
  )