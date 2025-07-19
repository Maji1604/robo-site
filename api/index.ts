import { app } from "./main";
import { poolInstance } from "./src/db";
import { Config } from "./src/shared/config";

const PORT = Config.port;

app.listen(PORT, async () => {
  try {
    console.log(`Server is running on http://localhost:${PORT} `);
    await poolInstance.connect();
    console.log("Connected to the database");
    console.log(`Docs are available at http://localhost:${PORT}/docs`);
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
});
