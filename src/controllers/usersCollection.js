import { getUsers } from "../config/db.js";

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
