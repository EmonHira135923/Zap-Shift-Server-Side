import { getRiders, getUsers } from "../config/db.js";

// Users Controller
export const usersController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const user = req.body;
    (user.role = "user"), (user.createdAt = new Date());
    const exitsUser = await usersCollection.findOne({ email: user?.email });
    if (!exitsUser) {
      const result = await usersCollection.insertOne(user);
      return res.status(201).send({
        success: true,
        message: "User created successfully",
        result,
      });
    }
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Could not create user",
      err: err.message,
    });
  }
};

// Riders Controller

// post controller
export const createRidersController = async (req, res) => {
  try {
    const ridersCollection = getRiders();
    const rider = req.body;
    rider.status = "pending";
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
    const riders = await ridersCollection.find({}).toArray();
    return res.status(200).send({
      message: "Riders fetched successfully",
      success: true,
      data: riders,
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
    const riders = await ridersCollection.find(query).toArray();
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
