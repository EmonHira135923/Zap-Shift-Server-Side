import express from "express";
import {
  createAllPercelController,
  deleteAllPercelController,
  findOnePercelController,
  getAllPercelByQueryController,
  getAllPercelController,
  updateAllPercelController,
} from "../controllers/percel.controller.js";

const router = express.Router();

router.get("/allpercels", getAllPercelController);
router.get("/payments/:id", findOnePercelController);
router.get("/mypercel", getAllPercelByQueryController);
router.post("/create-percel", createAllPercelController);
router.put("/update-percel/:id", updateAllPercelController);
router.delete("/delete-percel/:id", deleteAllPercelController);

export default router;
