const CustomError = require("../../utils/error");

const adminverify = async (req, res, next) => {
  try {
    const { role } = req.user;
    const isAdmin = role === "admin";
    if (!isAdmin) {
      throw new CustomError(402, "You are not authorized to access this route");
    }
    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = adminverify;
