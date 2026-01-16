import { getUsers } from "../config/db.js";

export const verifyAdminMiddleware = async (req, res, next) => {
  try {
    const userCollection = getUsers();
    const email = req.user?.email;
    console.log("users admin", email);
    const query = { email: email };
    const result = await userCollection.findOne(query);
    if (result && result.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        message: "Forbidden! Admin access required.",
        success: false,
        error: "User is not an admin.",
      });
    }
  } catch (err) {
    return res.status(403).json({
      message: "Forbidden! Admin access required.",
      success: false,
      error: err.message,
    });
  }
};
