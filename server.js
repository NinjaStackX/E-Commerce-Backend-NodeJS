import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./app.js";
import http from "http";
import { initSocket } from "./src/config/socket.js";

dotenv.config();

const server = http.createServer();

initSocket(server);

async function startServer() {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
