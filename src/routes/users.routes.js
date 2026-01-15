import express from "express";
import {
  deleteUserController,
  getUsersController,
  updateUserController,
  usersController,
} from "../controllers/usersCollection.js";
import { verifyFBTokenController } from "../middlewares/verifyFBToken.middlewares.js";

const router = express.Router();

// users
router.post("/register", usersController);

router.get("/users", verifyFBTokenController, getUsersController);

router.patch("/update-user/:id", verifyFBTokenController, updateUserController);

router.delete(
  "/delete-user/:id",
  verifyFBTokenController,
  deleteUserController
);

export default router;
