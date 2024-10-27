const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const {
  createOrderController,
  viewAllOrdersOfAPersonController,
  viewAllOrdersOnPlatformController,
  approveOrRejectOrderController,
} = require("../controllers/order-controller");
const verify = require("../middleware/auth/jwt-guard");
const normalverify = require("../middleware/auth/user-guard");
const adminverify = require("../middleware/auth/admin-guard");
const validateRequest = require("../middleware/input-validation-responder");

router.get("/place-order", verify, normalverify, createOrderController);

router.get(
  "/view-orders",
  verify,
  normalverify,
  viewAllOrdersOfAPersonController
);

router.get(
  "/orderActions/:orderId",
  verify,
  normalverify,
  adminverify,
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
