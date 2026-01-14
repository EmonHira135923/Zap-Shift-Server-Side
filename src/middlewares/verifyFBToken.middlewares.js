export const verifyFBTokenController = async (req, res, next) => {
  const headers = req.headers.authorization;
  console.log("heaeders", headers);
  next();
};
