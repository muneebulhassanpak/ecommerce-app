const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const {
  createOrderController,
  viewAllOrdersOfAPersonController,
  viewAllOrdersOnPlatformController,
} = require("../controllers/order-controller");
const verify = require("../middleware/auth/jwt-guard");
const normalverify = require("../middleware/auth/user-guard");
const validateRequest = require("../middleware/input-validation-responder");

router.get("/place-order", verify, normalverify, createOrderController);

router.put(
  "/view-orders",
  verify,
  normalverify,
  viewAllOrdersOfAPersonController
);

router.put(
  "/order-actions",
  verify,
  normalverify,
  adminverify,
  [
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "in-process", "declined"])
      .withMessage(
        "Status must be either 'pending' or 'in-process' or 'declined'"
      ),
  ],
  validateRequest,
  approveOrRejectOrderController
);

router.get(
  "/view-all-orders",
  verify,
  normalverify,
  adminverify,
  viewAllOrdersOnPlatformController
);

module.exports = router;
