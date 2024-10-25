require("dotenv").config();
const Product = require("../models/product");
const CustomError = require("../utils/error");

const {
  generateResponseWithPayload,
  generateResponseWithoutPayload,
} = require("../utils/response-helpers");

exports.createProductController = async (req, res, next) => {
  try {
    const { category, name, image, description, price, stock } = req.body;

    await Product.create({
      category,
      name,
      image,
      description,
      price,
      stock,
    });

    const response = generateResponseWithoutPayload(
      201,
      true,
      "Product Created successfully"
    );

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

exports.editProductController = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { category, name, image, description, price, stock } = req.body;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new CustomError(404, "No product found");
    }

    existingProduct.name = name;
    existingProduct.category = category;
    existingProduct.image = image;
    existingProduct.description = description;
    existingProduct.price = price;
    existingProduct.stock = stock;

    await existingProduct.save();

    const response = generateResponseWithoutPayload(
      200,
      true,
      "Product updated successfully"
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.deleteProductController = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new CustomError(404, "No product found");
    }

    const response = generateResponseWithoutPayload(
      204,
      true,
      "Product deleted successfully"
    );

    return res.status(204).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getAllProductsController = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, minPrice, maxPrice, rating } = req.query;

    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);

    const filter = {};
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice) {
        filter.price.$lte = maxPrice;
      }
    }
    if (rating) {
      filter.rating = { $gte: rating };
    }

    const products = await Product.find(filter)
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber);

    const totalProducts = await Product.countDocuments(filter);

    const response = {
      success: true,
      message: "Products retrieved successfully",
      data: products,
      pagination: {
        totalProducts,
        currentPage: pageNumber,
        pageSize: pageSizeNumber,
        totalPages: Math.ceil(totalProducts / pageSizeNumber),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

exports.getProductController = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new CustomError(404, "No product found");
    }

    const response = generateResponseWithPayload(
      201,
      true,
      "Product fetched successfully",
      existingProduct
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
