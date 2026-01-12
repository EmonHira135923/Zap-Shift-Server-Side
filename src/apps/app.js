import express from "express";
import cors from "cors";
import Stripe from "stripe";
import projectStart from "../routes/projectStart.routes.js";
import percel from "../routes/percel.routes.js";
import payment from "../routes/payment.routes.js";

const app = express();
const stripe = Stripe(process.env.PAYMENT_KEY);
// console.log(stripe);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes

// Project start
app.use("/api", projectStart);

// Percel
app.use("/api", percel);

// Payment
app.use("/api", payment);

export default app;
