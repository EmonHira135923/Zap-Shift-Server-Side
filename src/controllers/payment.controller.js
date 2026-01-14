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
    // console.log("session", session.unit_amount, session);
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
      currency,
      metadata,
      customer_email,
      amount_total,
      payment_intent,
    } = session;

    const id = metadata.id;
    const trackingId = generateTrackingId();

    // ✅ only paid accepted
    if (payment_status !== "paid") {
      return res.status(400).send({
        success: false,
        message: "Payment not completed",
      });
    }

    // update parcel
    const query = { _id: new ObjectId(id) };
    await percelCollection.updateOne(query, {
      $set: { paymentStatus: "paid", trackingId },
    });

    // prepare payment doc
    const payment = {
      totalCost: amount_total / 100,
      currency,
      customer_email,
      id,
      parcelName: metadata.parcelName,
      paymentStatus: payment_status,
      paidAt: new Date(),
      transaction_id: payment_intent,
    };

    // prevent duplicate insert
    const existing = await paymentCollection.findOne({
      transaction_id: payment_intent,
    });

    if (!existing) {
      await paymentCollection.insertOne(payment);
    }

    return res.status(200).send({
      success: true,
      message: "Payment verified successfully",
      trackingId,
      transaction_id: payment_intent,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Session not found or invalid",
      err: err.message,
    });
  }
};

// payments collection controller
export const getPaymentsController = async (req, res) => {
  try {
    const paymentCollection = getPayment();
    const email = req.query.email;
    const query = {};
    if (email) {
      query.customer_email = email;
    }

    // console.log("authoraizatiion", req.headers);

    const result = await paymentCollection.find(query).toArray();
    return res.status(200).send({
      success: true,
      message: "Payments fetched successfully",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Could not fetch payments",
      err: err.message,
    });
  }
};
