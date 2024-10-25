const User = require("../../models/user");
const CustomError = require("../../utils/error");

const normalverify = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const user = await User.findOne({ _id: id, role: role });
    if (!user) {
      throw new CustomError(402, "Invalid User");
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
    return next(err);
  }
};

module.exports = normalverify;
