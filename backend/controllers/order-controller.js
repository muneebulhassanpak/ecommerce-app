const Order = require("../models/order");
const Cart = require("../models/cart");
const {
  generateResponseWithoutPayload,
  generateResponseWithPayload,
} = require("../utils/response-helpers");
const CustomError = require("../utils/error");

exports.createOrderController = async (req, res, next) => {
  try {
    const user = req.user;

    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      throw new CustomError(400, "Cart is empty, cannot place an order");
    }

    for (let item of cart.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      if (product.stock < requestedQuantity) {
        throw new CustomError(
          400,
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${requestedQuantity}`
        );
      }

      product.stock -= requestedQuantity;
      await product.save();
    }

    const newOrder = await Order.create({
      user: user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount: cart.totalAmount,
      paymentDetails: req.body.paymentDetails || {},
    });

    cart.items = [];
    await cart.save();

    const response = generateResponseWithoutPayload(
      201,
      true,
      "Order created successfully"
    );

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.viewAllOrdersOfAPersonController = async (req, res, next) => {
  try {
    const user = req.user;
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const orders = await Order.find({ user: user._id })
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .populate("items.product");

    const response = generateResponseWithPayload(
      200,
      true,
      "User orders retrieved successfully",
      orders
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.viewAllOrdersOnPlatformController = async (req, res, next) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);

    const filter = status ? { status } : {};

    const orders = await Order.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .populate("user", "name email")
      .populate("items.product");

    const totalOrders = await Order.countDocuments(filter);

    const response = {
      success: true,
      message: "All platform orders retrieved successfully",
      data: orders,
      pagination: {
        totalEntries: totalOrders,
        currentPage: pageNumber,
        pageSize: pageSizeNumber,
        totalPages: Math.ceil(totalOrders / pageSizeNumber),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.approveOrRejectOrderController = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.query;

    const order = await Order.findById(orderId);

    if (!["in-process", "declined"].includes(status)) {
      throw new CustomError(400, "Invalid order status");
    }

    if (!order) {
      throw new CustomError(404, "Order not found");
    }

    order.status = status;
    await order.save();

    const response = generateResponseWithoutPayload(
      200,
      true,
      `Order status updated to '${status}' successfully`
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
