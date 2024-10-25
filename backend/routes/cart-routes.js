const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const {
  addToCartController,
  removeFromCartController,
  getCartController,
} = require("../controllers/cart-controller");
const verify = require("../middleware/auth/jwt-guard");
const normalverify = require("../middleware/auth/user-guard");
const validateRequest = require("../middleware/input-validation-responder");

router.post(
  "/add/:id",
  verify,
  normalverify,
  [
    param("id").isMongoId().withMessage("Invalid product ID"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric({ gt: 0 })
      .withMessage("Price must be a positive integer greater than 0"),
    body("quantity")
      .notEmpty()
      .withMessage("Product Quantity is required")
      .isInt({ gt: 0 })
      .withMessage(
        "Product Quantity must be a positive integer greater than 0"
      ),
  ],
  validateRequest,
  addToCartController
);

router.put(
  "/remove/:id",
  verify,
  normalverify,
  [
    param("id").isMongoId().withMessage("Invalid product ID"),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric({ gt: 0 })
      .withMessage("Price must be a positive integer greater than 0"),
    body("quantity")
      .notEmpty()
      .withMessage("Product Quantity is required")
      .isInt({ gt: 0 })
      .withMessage(
        "Product Quantity must be a positive integer greater than 0"
      ),
  ],
  validateRequest,
  removeFromCartController
);

router.get("/get-cart", verify, normalverify, getCartController);

module.exports = router;
