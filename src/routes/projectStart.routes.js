import express from "express";
import { projectStartController } from "../controllers/projectStart.controller.js";

const router = express.Router();

router.get("/", projectStartController);

export default router;
