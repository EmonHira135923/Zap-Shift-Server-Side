import { ObjectId } from "mongodb";
import { getPercel } from "../config/db.js";

// get Percel
export const getAllPercelController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const cursor = percelCollection.find({});
    const result = await cursor.toArray();
    res.status(200).send({
      message: "All Percel Here!!!",
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: "Products not found!!!",
      success: false,
      err: err.message,
    });
  }
};

// get percel by Query
export const getAllPercelByQueryController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const query = {};
    const { email } = req.query;
    // console.log("email", email, "Query", req.query);
    if (email) {
      query.senderEmail = email;
    }
    const cursor = percelCollection.find(query).sort({ createdAt: -1 });
    const result = await cursor.toArray();
    // console.log("result", result);
    res.status(200).send({
      message: "Your Percel Here!!!",
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: "Products not found!!!",
      success: false,
      err: err.message,
    });
  }
};

// create Percel
export const createAllPercelController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const query = req.body;
    const result = await percelCollection.insertOne(query);
    res.status(201).send({
      message: "Projects Created Successfully",
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: "Projects not created!!!",
      success: false,
      err: err.message,
    });
  }
};

// Percel using id percel
export const findOnePercelController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await percelCollection.findOne(query);
    console.log(
      "Find percel",
      result,
      "collection",
      percelCollection,
      "id",
      id,
      "q",
      query
    );
    res.status(200).send({
      message: "Get Your Percel",
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: "Percel Not Deleted",
      success: false,
      err: err.message,
    });
  }
};

export const updateAllPercelController = async (req, res) => {
  const percelCollection = getPercel();
};

// delete Percel
export const deleteAllPercelController = async (req, res) => {
  try {
    const percelCollection = getPercel();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await percelCollection.deleteOne(query);
    // console.log("result", result);
    res.status(200).send({
      message: "Percel Successfully Deleted",
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).send({
      message: "Percel Not Deleted",
      success: false,
      err: err.message,
    });
  }
};
