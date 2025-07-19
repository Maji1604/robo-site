import { router } from "@/modules/router";
import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => ({
  status: "ok",
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
  name: process.env.API_NAME || "creoleap",
  version: process.env.API_VERSION || "1.0.0",
}));

app.use(cors());

app.use(
  swagger({
    path: "/docs",
    exclude: ["/docs", "/docs/json"],
    theme: "dark",
    documentation: {
      servers: [
        {
          url: "/",
        },
      ],
      info: {
        title: "Creoleap api",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            scheme: "bearer",
            type: "http",
            bearerFormat: "JWT",
          },
        },
      },
    },
  })
);

app.onError(({ code, error }) => {
  if (code === "VALIDATION") {
    return {
      status: 400,
      body: error.all,
    };
  }
});

app.trace(async ({ onHandle }) => {
  onHandle(({ begin, onStop }) => {
    onStop(({ end }) => {
      console.log("handle took", end - begin, "ms");
    });
  });
});

app.use(router);

export { app };
export type App = typeof app;