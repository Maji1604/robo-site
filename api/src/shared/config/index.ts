type IConfig = {
  port: number;
  apiname: string;
  apiversion: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
};

export const Config: IConfig = {
  port: parseInt(process.env.PORT || "3000"),
  apiname: process.env.API_NAME || "Creoleap",
  apiversion: process.env.API_VERSION || "v1",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "database",
  },
};
