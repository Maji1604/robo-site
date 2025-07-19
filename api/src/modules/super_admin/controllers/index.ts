import Elysia from "elysia";
import { adminAuthController } from "./auth.controller";
import { institutionController } from "./institute.controller";
import { adminController } from "./admin.controller";
import { staffController } from "./staff.controller";
import { departmentController } from "./department.controller";
import { classController } from "./class.controller";
import { studentController } from "./student.controller";

const adminBaseController = new Elysia({
  prefix: "/admin",
})

.use(adminAuthController)
.use(institutionController)
.use(adminController)
.use(staffController)
.use(departmentController)
.use(classController)
.use(studentController)
export { adminBaseController };
