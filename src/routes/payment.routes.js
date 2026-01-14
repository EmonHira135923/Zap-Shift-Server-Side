import express from "express";
import {
  getPaymentsController,
  paymentController,
  verifyPaymentController,
} from "../controllers/payment.controller.js";
import { verifyFBTokenController } from "../middlewares/verifyFBToken.middlewares.js";

const router = express.Router();

router.post("/create-checkout-session", paymentController);
router.patch("/verify-payment", verifyPaymentController);
router.get("/allpayments", verifyFBTokenController, getPaymentsController);

export default router;
