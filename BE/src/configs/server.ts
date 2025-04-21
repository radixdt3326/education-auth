import http from "http";
import app from "./appconfigs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const port = process.env.PORT || "8000";
app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});

server.on("error", (error: { syscall: string; code: string }) => {
  if (error.syscall !== "listen") throw error;

  switch (error.code) {
    case "EACCES":
      process.exit(1);
      break;
    case "EADDRINUSE":
      process.exit(1);
      break;
    default:
      throw error;
  }
});
