const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const {
  loginController,
  signupController,
  fetchingController,
} = require("../controllers/auth-controller");
const verify = require("../middleware/auth/jwt-guard");
const normalverify = require("../middleware/auth/user-guard");
const validateRequest = require("../middleware/input-validation-responder");

router.post(
  "/signup",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{2,})/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and two digits"
      ),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(["admin", "user"])
      .withMessage("Role must be either 'admin' or 'user'"),
  ],
  validateRequest,
  signupController
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginController
);

router.get("/getData", verify, normalverify, fetchingController);

module.exports = router;
