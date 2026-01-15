// Riders Controller
import { ObjectId } from "mongodb";
import { getRiders } from "../config/db.js";

// post controller
export const createRidersController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const rider = req.body;
    rider.status = "pending";
    rider.role = "user";
    rider.createdAt = new Date();
    const exitsRider = await ridersCollection.findOne({ email: rider?.email });
    if (!exitsRider) {
      const result = await ridersCollection.insertOne(rider);
      return res.status(201).send({
        success: true,
        message: "Rider created successfully",
        result,
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Could not create rider",
      err: err.message,
    });
  }
};

// get all riders
export const getAllRidersController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const cursor = ridersCollection.find().sort({ createdAt: -1 });
    const result = await cursor.toArray();
    return res.status(200).send({
      message: "Riders fetched successfully",
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Could not get riders",
      success: false,
      err: err.message,
    });
  }
};

// get riders by status
export const getStatusController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    const cursor = ridersCollection.find(query).sort({ createdAt: -1 });
    const result = await cursor.toArray();
    return res.status(200).send({
      message: "Riders status fetched successfully",
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Could not get status",
      success: false,
      err: err.message,
    });
  }
};

// Update rider status
export const updateRiderStatusController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const { status } = req.body;
    const id = req.params.id;

    const result = await ridersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    let rolechange = null;

    if (status === "approved") {
      rolechange = await ridersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: "rider" } }
      );
    }

    return res.status(200).send({
      message: "Rider status updated successfully",
      success: true,
      result,
      rolechange,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Could not update rider status",
      success: false,
      err: err.message,
    });
  }
};

// delete rider
export const deleteRiderController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await ridersCollection.deleteOne(query);
    return res.status(200).send({
      message: "Rider deleted successfully",
      success: true,
      result,
    });
  } catch (err) {
    return res.status(500).send({
      message: "Could not delete rider",
      success: false,
      err: err.message,
    });
  }
};
