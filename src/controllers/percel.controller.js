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
    const query = req.body;
    const { email } = req.query;
    // console.log("email", email, "Query", req.query);
    if (email) {
      query.email = email;
    }
    const cursor = percelCollection.find(query);
    const result = await cursor.toArray();
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

// update Percel
export const updateAllPercelController = async (req, res) => {
  const percelCollection = getPercel();
};

// delete Percel
export const deleteAllPercelController = async (req, res) => {
  const percelCollection = getPercel();
};
