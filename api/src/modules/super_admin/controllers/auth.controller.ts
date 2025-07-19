import { db } from "@/db";
import { admin, institutions } from "@/db/schema";
import { PasetoUtil } from "@/shared/utils/paseto";
import { hashPassword, verifyPassword } from "@/shared/utils/password";
import Elysia, { t } from "elysia";
import { v7 as uuidv7 } from "uuid";
import { and, eq, or } from "drizzle-orm";

export const adminAuthController = new Elysia({
  prefix: "/auth",
  tags: ["Admin Auth"],
})
.post(
  "/register",
  async ({ body, set }) => {
    try {
      const { email, password, mobileNumber, name, role, institutionId } = body;

      // Validate required fields
      if (!email || !password || !name || !role || !mobileNumber) {
        set.status = 400;
        return {
          message: "Email, mobile number, password, name, and role are required",
        };
      }

      if (email.length > 45) {
        set.status = 400;
        return { message: "Email must be 45 characters or less" };
      }

      if (name.length > 45) {
        set.status = 400;
        return { message: "Name must be 45 characters or less" };
      }

      if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
        set.status = 400;
        return { message: "Mobile number must be a 10-digit number" };
      }

      if (password.length < 8) {
        set.status = 400;
        return { message: "Password must be at least 8 characters long" };
      }

      if (!["super_admin", "admin"].includes(role)) {
        set.status = 400;
        return { message: "Invalid role. Must be 'super_admin' or 'admin'" };
      }

      if (role === "admin" && !institutionId) {
        set.status = 400;
        return { message: "Institution ID is required for admin role" };
      }

      if (role === "super_admin" && institutionId) {
        set.status = 400;
        return { message: "Institution ID must be null for super_admin role" };
      }

      // Validate institution existence
      let targetInstitution = null;
      if (role === "admin" && institutionId) {
        targetInstitution = await db.query.institutions.findFirst({
          where: eq(institutions.id, institutionId),
        });

        if (!targetInstitution) {
          set.status = 400;
          return { message: "Invalid institute ID" };
        }
      }

      // Check for active user conflict
      const existing = await db.query.admin.findFirst({
        where: and(
          or(
            eq(admin.email, email),
            eq(admin.mobileNumber, mobileNumber)
          ),
          eq(admin.isDeleted, false)
        ),
      });

      if (existing) {
        set.status = 409;
        return {
          message: existing.email === email ? "Email already exists" : "Mobile number already exists",
        };
      }

      // Anonymize deleted users
      const existingDeleted = await db.query.admin.findFirst({
        where: and(
          or(
            eq(admin.email, email),
            eq(admin.mobileNumber, mobileNumber)
          ),
          eq(admin.isDeleted, true)
        ),
      });

      if (existingDeleted) {
        const timestamp = Date.now();
        await db.update(admin)
          .set({
            email: `${existingDeleted.email}_deleted_${timestamp}`,
            mobileNumber: `99999${Math.floor(10000 + Math.random() * 89999)}`,
            updatedAt: new Date(),
          })
          .where(eq(admin.id, existingDeleted.id));
      }

      // Hash password
      const passwordHash = await hashPassword(password);
      if (!passwordHash) {
        set.status = 500;
        return { message: "Password hashing failed" };
      }

      // Insert new admin
      const newAdminId = uuidv7();
      const [newAdmin] = await db
        .insert(admin)
        .values({
          id: newAdminId,
          email,
          mobileNumber,
          passwordHash,
          name,
          role,
          institutionId: role === "admin" ? institutionId : null,
          isActive: true,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: admin.id,
          email: admin.email,
          mobileNumber: admin.mobileNumber,
          name: admin.name,
          role: admin.role,
          institutionId: admin.institutionId,
          isActive: admin.isActive,
          createdAt: admin.createdAt,
        });

      // Update institution.adminIds
      if (role === "admin" && targetInstitution) {
        const updatedAdminIds = [...targetInstitution.adminIds, newAdminId];
        await db
          .update(institutions)
          .set({
            adminIds: updatedAdminIds,
            updatedAt: new Date(),
          })
          .where(eq(institutions.id, institutionId));
      }

      set.status = 201;
      return {
        message: "Admin created successfully",
        data: newAdmin,
      };
    } catch (error) {
      console.error("Error creating admin:", error);
      set.status = 500;
      return { message: "Failed to create admin" };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email", maxLength: 45 }),
      password: t.String({ minLength: 8 }),
      mobileNumber: t.String({ pattern: "^\\d{10}$", maxLength: 10, minLength: 10 }),
      name: t.String({ minLength: 1, maxLength: 45 }),
      role: t.Enum({ super_admin: "super_admin", admin: "admin" }),
      institutionId: t.Optional(t.String({ format: "uuid" })),
    }),
    detail: {
      summary: "Register a new admin",
      description:
        "Create a new admin user (super_admin or admin) with email, mobile number, password, name, role, and optional institutionId (required for admin).",
    },
  }
)


.post(
  "/login",
  async ({ body, headers, set }) => {
    try {
      const { email, password } = body;

      let ip: any = headers["ip-address"] ?? "";
      
      // Validate required fields
      if (!email || !password) {
        set.status = 400;
        return {
          message: "Email and password are required",
        };
      }

      // Find user
      const existing = await db.query.admin.findFirst({
        where: eq(admin.email, email),
      });

      if (!existing) {
        set.status = 401;
        return {
          message: "Email not found",
        };
      }

      // Check active status
      if (!existing.isActive) {
        set.status = 403;
        return {
          message: "Account is inactive",
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        existing.passwordHash,
        password
      );
      if (!isPasswordValid) {
        set.status = 401;
        return {
          message: "Invalid password",
        };
      }

      await db
        .update(admin)
        .set({
          lastLogin: new Date(),
          lastIp: ip["address"],
          lastUserAgent: headers["user-agent"],
        })
        .where(eq(admin.id, existing.id));

      // Generate token
      const token = await PasetoUtil.encodePaseto(
        {
          id: existing.id,
          email: existing.email,
          role: existing.role,
          institutionId: existing.institutionId ?? undefined,
        },
        existing.role
      );

      if (!token) {
        set.status = 500;
        return {
          message: "Failed to generate authentication token",
        };
      }

      // Set cookies
      set.cookie = {
        admin: {
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        },
        role: {
          value: existing.role,
          httpOnly: false, // Allow client-side access
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        },
      };

      set.status = 200;
      return {
        message: "Login successful",
        data: {
          user: {
            id: existing.id,
            email: existing.email,
            role: existing.role,
            institutionId: existing.institutionId,
          },
        },
      };
    } catch (error) {
      console.error("Error during admin login:", error);
      set.status = 500;
      return {
        message: "Login failed",
      };
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    }),
    detail: {
      summary: "Login as an admin",
      description:
        "Authenticate an admin user (super_admin, admin, or teacher) and return user data with a token and role in cookies.",
    },
  }
)