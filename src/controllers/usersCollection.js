import { ObjectId } from "mongodb";
import { getUsers } from "../config/db.js";

// Users Controller
// post controller
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

// get Controller
export const getUsersController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const users = usersCollection.find().sort({ createdAt: -1 });
    const result = await users.toArray();
    return res.status(200).send({
      success: true,
      message: "Users fetched successfully",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      err: err.message,
      message: "Could not fetch users",
    });
  }
};

// get single user controller
export const getSingleUserController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.findOne(query);
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Could not fetch user",
      err: err.message,
    });
  }
};

// get user by role controller
export const getUserByRoleController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const email = req.params.email;
    console.log("users", email);
    const query = { email: email };
    const result = await usersCollection.findOne(query);
    return res.status(200).send({
      success: true,
      message: "User fetched successfully by role",
      result: { role: result?.role || "user" },
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Could not fetch user by role",
      err: err.message,
    });
  }
};

// update controller
export const updateUserController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const id = req.params.id;
    const updateData = req.body;
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        role: updateData.role,
      },
    };
    const result = await usersCollection.updateOne(query, updateDoc);
    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      err: err.message,
      message: "Could not update user",
    });
  }
};

// Delete Controller
export const deleteUserController = async (req, res) => {
  try {
    const usersCollection = getUsers();
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      err: err.message,
      message: "Could not delete user",
    });
  }
};
