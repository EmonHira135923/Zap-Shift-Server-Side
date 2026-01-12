import express from "express";
import { paymentController } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", paymentController);

export default router;
