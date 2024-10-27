require("dotenv").config();
const Product = require("../models/product");
const Cart = require("../models/cart");
const CustomError = require("../utils/error");

const {
  generateResponseWithPayload,
  generateResponseWithoutPayload,
} = require("../utils/response-helpers");

exports.addToCartController = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError(404, "No product found");
    }

    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      cart = new Cart({
        user: user._id,
        items: [{ product: product._id, quantity: 1, price: product.price }],
      });
    } else {
      const productIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        cart.items[productIndex].quantity += 1;
      } else {
        cart.items.push({
          product: product._id,
          quantity: 1,
          price: product.price,
        });
      }
    }

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.price * item.quantity; // Sum price * quantity for each item
    }, 0);

    await cart.save();

    const response = generateResponseWithoutPayload(
      201,
      true,
      "Product added to cart successfully"
    );

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.removeFromCartController = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw new CustomError(404, "No cart found for this user");
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      throw new CustomError(404, "Product not found in cart");
    }

    if (cart.items[productIndex].quantity > 1) {
      cart.items[productIndex].quantity -= 1;
    } else {
      cart.items.splice(productIndex, 1);
    }

    await cart.save();

    const response = generateResponseWithoutPayload(
      200,
      true,
      "Product removed from cart successfully"
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getCartController = async (req, res, next) => {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );
    if (!cart) {
      throw new CustomError(404, "No cart found for this user");
    }

    const response = generateResponseWithPayload(
      200,
      true,
      "Cart retrieved successfully",
      cart.items
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
