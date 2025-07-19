import { db } from "@/db";
import { students, classes, institutions } from "@/db/schema";
import Elysia, { t } from "elysia";
import { eq, ilike, and, count, asc, inArray } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { adminAuthMacro } from "../admin-macro";


// Define types for your tables
interface Institution {
    id: string;
    name: string;
    // Add other fields as necessary
  }
  
  interface Class {
    id: string;
    institutionId: string;
    grade: string;
    section: string;
    // Add other fields as necessary
  }
  
  interface Student {
    id: string;
    name: string;
    classId: string;
    institutionId: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    // Add other fields as necessary
  }

  
export const studentController = new Elysia({
  prefix: "/students",
  tags: ["Students"],
})
  .use(adminAuthMacro)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const { name, classId } = body;

        // Validate required fields
        if (!name || !classId) {
          set.status = 400;
          return { message: "Name and classId are required" };
        }

        // Validate class
        const classData = await db.query.classes.findFirst({
          where: eq(classes.id, classId),
        });

        if (!classData || classData.isDeleted) {
          set.status = 404;
          return { message: "Class not found" };
        }

        // Insert new student
        const [newStudent] = await db
          .insert(students)
          .values({
            id: uuidv7(),
            name,
            classId,
            institutionId: classData.institutionId,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();

        set.status = 201;
        return {
          message: "Student created successfully",
          data: newStudent,
        };
      } catch (error) {
        console.error("Error creating student:", error);
        set.status = 500;
        return { message: "Failed to create student" };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        classId: t.String({ format: "uuid" })
      }),
      detail: {
        summary: "Create a new student",
        description: "Create a new student with the provided details.",
      },
    }
  )
  .get("/", async ({ query, set }) => {
    try {
      const { search, classId, institutionId, page = 1, limit = 10 } = query;
  
      // Validate pagination parameters
      if (Number(page) < 1) {
        set.status = 400;
        return { message: "Page must be at least 1" };
      }
  
      if (Number(limit) < 1 || Number(limit) > 100) {
        set.status = 400;
        return { message: "Limit must be between 1 and 100" };
      }
  
      const offset = (Number(page) - 1) * Number(limit);
  
      // Base conditions
      const baseWhere = and(
        eq(students.isDeleted, false),
        institutionId ? eq(students.institutionId, institutionId) : undefined,
        classId ? eq(students.classId, classId) : undefined
      );
  
      // Add search condition if provided
      const searchCondition = search
        ? and(baseWhere, ilike(students.name, `%${search.toLowerCase()}%`))
        : baseWhere;
  
      // Fetch students
      const [allStudents, totalItems] = await Promise.all([
        db.query.students.findMany({
          where: searchCondition,
          limit: Number(limit),
          offset: offset,
          orderBy: asc(students.name),
        }),
        db.select({ count: count() }).from(students).where(searchCondition),
      ]);
  
      // Fetch related class and institution data
      const studentClassIds = allStudents.map(student => student.classId);
      const studentInstitutionIds = allStudents.map(student => student.institutionId);
     
      const classData = await db.query.classes.findMany({
        where: inArray(classes.id, studentClassIds),
      });
       
      const institutionData = await db.query.institutions.findMany({
        where: inArray(institutions.id, studentInstitutionIds),
      });
      const classMap = new Map(classData.map((cls: { id: any; }) => [cls.id, cls]));
      const institutionMap = new Map(institutionData.map((inst: { id: any; }) => [inst.id, inst]));
  
  
      
  
      // Map classes and institutions for quick lookup
    
      // Combine student data with class and institution details
      const studentsWithDetails = allStudents.map(student => ({
        ...student,
        class: classMap.get(student.classId),
        institution: institutionMap.get(student.institutionId),
      }));
  
      const totalCount = totalItems[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / Number(limit));
  
      if (allStudents.length === 0) {
        return {
          message: search
            ? `No students found matching search term: ${search}`
            : "No students found in the database",
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
        message: "Students retrieved successfully",
        data: studentsWithDetails,
        pagination: {
          totalItems: totalCount,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      };
    } catch (error: any) {
      console.error("Error retrieving students:", error);
      set.status = 500;
      return { message: `Failed to retrieve students: ${error.message}` };
    }
  })
  

  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const studentData = await db.query.students.findFirst({
          where: eq(students.id, id),
        });

        if (!studentData || studentData.isDeleted) {
          set.status = 404;
          return { message: "Student not found" };
        }

        set.status = 200;
        return {
          message: "Student retrieved successfully",
          data: studentData,
        };
      } catch (error) {
        console.error("Error retrieving student:", error);
        set.status = 500;
        return { message: "Failed to retrieve student" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Get student by ID",
        description: "Retrieve a specific student by its UUID.",
      },
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const { name, email, classId, isActive } = body;

        if (!name || !classId) {
          set.status = 400;
          return { message: "Name and classId are required" };
        }

        // Validate class
        const classData = await db.query.classes.findFirst({
          where: eq(classes.id, classId),
        });

        if (!classData || classData.isDeleted) {
          set.status = 404;
          return { message: "Class not found" };
        }

        const [updatedStudent] = await db
          .update(students)
          .set({
            name,
            classId,
            isActive,
            updatedAt: new Date(),
          })
          .where(eq(students.id, id))
          .returning();

        if (!updatedStudent) {
          set.status = 404;
          return { message: "Student not found" };
        }

        set.status = 200;
        return {
          message: "Student updated successfully",
          data: updatedStudent,
        };
      } catch (error) {
        console.error("Error updating student:", error);
        set.status = 500;
        return { message: "Failed to update student" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        name: t.String({ minLength: 1, maxLength: 100 }),
        email: t.Optional(t.String({ format: "email" })),
        classId: t.String({ format: "uuid" }),
        isActive: t.Boolean(),
      }),
      detail: {
        summary: "Update a student",
        description: "Update an existing student by its UUID.",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      try {
        const existing = await db.query.students.findFirst({
          where: eq(students.id, id),
        });

        if (!existing || existing.isDeleted) {
          set.status = 404;
          return { message: "Student not found" };
        }

        // Soft delete student
        await db
          .update(students)
          .set({ isDeleted: true, updatedAt: new Date() })
          .where(eq(students.id, id));

        set.status = 200;
        return { message: "Student deleted successfully" };
      } catch (error) {
        console.error("Error deleting student:", error);
        set.status = 500;
        return { message: "Failed to delete student" };
      }
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        summary: "Delete a student",
        description: "Soft delete a student by setting isDeleted to true.",
      },
    }
  )
  .patch(
    "/:id/toggle-status",
    async ({ params: { id }, body, set }) => {
      try {
        const { isActive } = body;

        const [updatedStudent] = await db
          .update(students)
          .set({
            isActive: !isActive,
            updatedAt: new Date(),
          })
          .where(eq(students.id, id))
          .returning();

        if (!updatedStudent) {
          set.status = 404;
          return { message: "Student not found" };
        }

        set.status = 200;
        return {
          message: "Student status updated successfully",
          data: updatedStudent,
        };
      } catch (error) {
        console.error("Error updating student status:", error);
        set.status = 500;
        return { message: "Failed to update student status" };
      }
    },
    {
      body: t.Object({
        isActive: t.Boolean(),
      }),
      detail: {
        summary: "Toggle student status",
        description: "Toggle the active status of a student by its UUID.",
      },
    }
  );
