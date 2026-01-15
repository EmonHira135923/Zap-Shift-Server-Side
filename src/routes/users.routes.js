import express from "express";
import {
  createRidersController,
  usersController,
} from "../controllers/usersCollection.js";
import { getAllPercelByQueryController } from "../controllers/percel.controller.js";

const router = express.Router();

// users
router.post("/register", usersController);

// riders
router.post("/create-rider", createRidersController);
router.get("/riders", getAllPercelByQueryController);

export default router;
