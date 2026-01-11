import express from "express";
import cors from "cors";
import projectStart from "../routes/projectStart.routes.js";
import percel from "../routes/percel.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

// Project start
app.use("/api", projectStart);

// Percel
app.use("/api", percel);

export default app;
