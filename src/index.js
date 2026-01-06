import dotenv from "dotenv";
dotenv.config();
import app from "./apps/app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 3000;

// start server
const StartServer = async () => {
  // Db Connection
  await connectDB();

  // Project Running
  app.listen(port, () => {
    console.log(`Zap Shift Project is running now ${port}`);
  });
};

StartServer();
