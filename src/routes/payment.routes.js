import express from "express";
import {
  paymentController,
  verifyPaymentController,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", paymentController);
router.patch("/verify-payment", verifyPaymentController);

export default router;
