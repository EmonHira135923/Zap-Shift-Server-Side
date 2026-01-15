import express from "express";
import {
  createRidersController,
  deleteRiderController,
  getAllRidersController,
  updateRiderStatusController,
} from "../controllers/riders.controller.js";
import { verifyFBTokenController } from "../middlewares/verifyFBToken.middlewares.js";

const router = express.Router();

// riders
router.post("/create-rider", createRidersController);
router.get("/riders", getAllRidersController);
router.patch(
  "/update-rider/:id",
  verifyFBTokenController,
  updateRiderStatusController
);
router.delete(
  "/delete-rider/:id",
  verifyFBTokenController,
  deleteRiderController
);

export default router;
