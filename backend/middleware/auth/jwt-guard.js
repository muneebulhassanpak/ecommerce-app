require("dotenv").config();
const jwt = require("jsonwebtoken");
const CustomError = require("../../utils/error");

const verify = (req, res, next) => {
  try {
    const recievedToken = req?.headers?.cookie?.split("=")[1];
    if (!recievedToken) {
      throw new CustomError(401, "Authorization token not found");
    }
    const data = jwt.verify(recievedToken, process.env.SECRET_KEY);
    req.user = data;
    next();
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = verify;
