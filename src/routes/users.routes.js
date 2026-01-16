import express from "express";
import {
  deleteUserController,
  getSingleUserController,
  getUserByRoleController,
  getUsersController,
  updateUserController,
  usersController,
} from "../controllers/usersCollection.js";
import { verifyFBTokenController } from "../middlewares/verifyFBToken.middlewares.js";
import { verifyAdminMiddleware } from "../middlewares/verifyAdmin.middlewares.js";

const router = express.Router();

// users
router.post("/register", usersController);

router.get("/users", verifyFBTokenController, getUsersController);

router.get("/user/:id", getSingleUserController);

router.get(
  "/users/:email/role",
  verifyFBTokenController,
  verifyAdminMiddleware,
  getUserByRoleController
);

router.patch(
  "/update-user/:id/role",
  verifyFBTokenController,
  updateUserController
);

router.delete(
  "/delete-user/:id",
  verifyFBTokenController,
  deleteUserController
);

export default router;
