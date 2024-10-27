require("dotenv").config();
const User = require("../models/user");
const CustomError = require("../utils/error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  generateResponseWithPayload,
  generateResponseWithoutPayload,
} = require("../utils/response-helpers");

exports.signupController = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    if (role === "admin") {
      const existingUser = await User.findOne({ role: "admin" });
      if (existingUser) {
        throw new CustomError(400, "An admin already exists");
      }
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError(400, "A user with the same email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ name, email, role, password: hashedPassword });

    const response = generateResponseWithoutPayload(
      201,
      true,
      "User Created successfully"
    );

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new CustomError(400, "Invalid email address");
    }

    const doPasswordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!doPasswordsMatch) {
      throw new CustomError(400, "Invalid password");
    }

    const cookieData = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.SECRET_KEY
    );
    const payloadData = {
      name: existingUser.name,
      role: existingUser.role,
      email: existingUser.email,
    };
    const response = generateResponseWithPayload(
      200,
      true,
      "Login successfully",
      payloadData
    );
    return res.status(200).cookie("access_token", cookieData).json(response);
  } catch (error) {
    next(error);
  }
};

exports.fetchingController = async (req, res, next) => {
  const user = req.user;
  try {
    const payloadData = {
      name: user.name,
      role: user.role,
      email: user.email,
    };
    const response = generateResponseWithPayload(
      200,
      true,
      "User data Fetch successfully",
      payloadData
    );
    return res.status(200).json(response);
  } catch (err) {
    return next(err);
  }
};

exports.updateProfileController = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const existingUser = await User.findOne({ email });

    existingUser.name = name;
    existingUser.email = email;

    await existingUser.save();

    const payloadData = {
      name: existingUser.name,
      role: existingUser.role,
      email: existingUser.email,
    };

    const response = generateResponseWithPayload(
      200,
      true,
      "Profile updated successfully",
      payloadData
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
