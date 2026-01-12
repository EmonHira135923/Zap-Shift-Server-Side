import app from "../apps/app.js";
import Stripe from "stripe";

const stripe = Stripe(process.env.PAYMENT_KEY);

export const paymentController = async (req, res) => {
  try {
    const paymentInfo = req.body;
    const amount = Math.round(paymentInfo.totalPrice * 100); // safer

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // অবশ্যই লাগবে
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: paymentInfo.percelName, // parcelName থেকে percelName
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: paymentInfo.senderEmail,
      mode: "payment",
      metadata: {
        id: paymentInfo.id,
      },
      success_url: `${process.env.SITE_DOMAIN}/dashboard/payments/success`,
      cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payments/cancel`,
    });

    console.log("payment session", session);
    res.status(200).send({
      message: "Payment session created successfully",
      success: true,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe Error:", err.message);
    res.status(500).send({
      message: "Payment not successful",
      success: false,
      err: err.message,
    });
  }
};
