const express = require("express");
const { body, param } = require("express-validator");

const router = express.Router();
const {
  createProductController,
  editProductController,
  deleteProductController,
  getAllProductsController,
  getProductController,
} = require("../controllers/product-controller");
const verify = require("../middleware/auth/jwt-guard");
const normalverify = require("../middleware/auth/user-guard");
const adminverify = require("../middleware/auth/admin-guard");
const validateRequest = require("../middleware/input-validation-responder");

router.post(
  "/create",
  verify,
  normalverify,
  adminverify,
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("image")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ min: 2 })
      .withMessage("Description must be at least 2 characters long"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isLength({ min: 2 })
      .withMessage("Category must be at least 2 characters long"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric({ gt: 0 })
      .withMessage("Price must be a positive integer greater than 0"),
    body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .isInt({ gt: 0 })
      .withMessage("Stock must be a positive integer greater than 0"),
  ],
  validateRequest,
  createProductController
);

router.put(
  "/edit/:id",
  verify,
  normalverify,
  adminverify,
  [
    param("id").isMongoId().withMessage("Invalid product ID"),
    body("name")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters long"),
    body("description")
      .optional()
      .isLength({ min: 2 })
      .withMessage("Description must be at least 2 characters long"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric({ gt: 0 })
      .withMessage("Price must be a positive integer greater than 0"),
    body("stock")
      .notEmpty()
      .withMessage("Stock is required")
      .isInt({ gt: 0 })
      .withMessage("Stock must be a positive integer greater than 0"),
    body("rating").isNumeric().withMessage("Rating must be a number"),
  ],
  validateRequest,
  editProductController
);

router.delete(
  "/delete/:id",
  verify,
  normalverify,
  adminverify,
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  deleteProductController
);

router.get("/get-all-products", getAllProductsController);

router.get(
  "/get-product/:id",
  [param("id").isMongoId().withMessage("Invalid product ID")],
  validateRequest,
  getProductController
);

module.exports = router;
