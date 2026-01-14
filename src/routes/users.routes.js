import express from "express";
import { usersController } from "../controllers/usersCollection.js";

const router = express.Router();

router.post("/register", usersController);

export default router;
