import { ObjectId } from "mongodb";
import Stripe from "stripe";
import { getPayment, getPercel } from "../config/db.js";
import { generateTrackingId } from "../utils/tracking.js";

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
        parcelName: paymentInfo.parcelName,
        senderRegion: paymentInfo.senderRegion,
        senderDistrict: paymentInfo.senderDistrict,
        senderName: paymentInfo.senderName,
        senderAddress: paymentInfo.senderAddress,
        senderPhone: paymentInfo.senderPhone,
        receiverRegion: paymentInfo.receiverRegion,
        receiverDistrict: paymentInfo.receiverDistrict,
        receiverName: paymentInfo.receiverName,
        receiverEmail: paymentInfo.receiverEmail,
        receiverAddress: paymentInfo.receiverAddress,
        receiverContact: paymentInfo.receiverContact,
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
    const paymentCollection = getPayment();
    const session_id = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const {
      payment_status,
      parcelName,
      currency,
      metadata,
      customer_email,
      created,
      amount_total,
      payment_intent,
    } = session;
    console.log("session", session);
    const id = metadata.id;
    const trackingId = generateTrackingId();
    if (payment_status) {
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          paymentStatus: "paid",
          trackingId: trackingId,
        },
      };
      const payment = {
        totalCost: amount_total / 100,
        currency: currency,
        customer_email: customer_email,
        id: id,
        parcelName: parcelName,
        paymentStatus: payment_status,
        paidAt: new Date(),
        transaction_id: payment_intent,
      };
      const result = await percelCollection.updateOne(query, update);
      if (payment_status) {
        const payments = await paymentCollection.insertOne(payment);
        res.status(200).send({
          message: "Your session id is here",
          success: true,
          result,
          payments,
          trackingId: trackingId,
          transaction_id: payment_intent,
        });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: "Your session id is not found",
      success: false,
      err: err.message,
    });
  }
};
