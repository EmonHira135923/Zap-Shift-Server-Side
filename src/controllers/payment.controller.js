import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { getPercel } from "../config/db.js";

const stripe = Stripe(`${process.env.PAYMENT_KEY}`);

// Payment controller api
export const paymentController = async (req, res) => {
  try {
    const paymentInfo = req.body;
    const totalCost = parseInt(paymentInfo.totalPrice * 100);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: paymentInfo.parcelName,
            },
            unit_amount: totalCost,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: paymentInfo.senderEmail,
      metadata: {
        id: paymentInfo.id,
      },
      success_url: `${process.env.SITE_DOMAIN}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payments/cancel`,
    });
    console.log("session", session.unit_amount, session);
    return res.status(200).send({
      message: "Payment Successfully Done",
      success: true,
      result: session.url,
    });
  } catch (err) {
    res.status(500).send({
      message: "Oh Payment Incomplete",
      success: false,
      err: err.message,
    });
  }
};

// verify payment
export const verifyPaymentController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const session_id = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    // console.log("session", session);
    const { payment_status, metadata, customer_email, created } = session;
    const id = metadata.id;
    if (payment_status) {
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          paymentStatus: "paid",
          customer_email,
          created,
        },
      };
      const result = await percelCollection.updateOne(query, update);
      res.status(200).send({
        message: "Your session id is here",
        success: true,
        result,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Your session id is not found",
      success: true,
      err: err.message,
    });
  }
};
