import { PasetoUtil } from "@/shared/utils/paseto";
import Elysia from "elysia";

export const adminAuthMacro = new Elysia({}).macro({
  isAuth: {
    async resolve({ headers, set }) {
      try {
        const token = headers["x-super-admin"];

        if (!token) {
          set.status = 401;
          throw new Error("Unauthorized");
        }

        if (!token.startsWith("v4.local")) {
          set.status = 401;
          throw new Error("Invalid token");
        }

        const payload = await PasetoUtil.decodePaseto(token, "super_admin");

        return {
          user: payload,
        };
      } catch (error) {
        console.error("Error during authentication:", error);
        throw new Error("Invalid token");
      }
    },
  },
});
