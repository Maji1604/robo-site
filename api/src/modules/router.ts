import Elysia from "elysia";
import { adminBaseController } from "./super_admin/controllers";


export const router = new Elysia({
  prefix: "/api",
})

.use(adminBaseController)