import admin from "../config/firebase.admin.js";

export const verifyFBTokenController = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized! No token provided.",
        success: false,
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Invalid token format.",
        success: false,
        data: null,
      });
    }

    // verify firebase token
    const userinfo = await admin.auth().verifyIdToken(token);

    req.user = userinfo;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized! Token verification failed.",
      success: false,
      error: err.message,
    });
  }
};
