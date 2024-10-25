const { validationResult } = require("express-validator");
const { generateResponseWithPayload } = require("../utils/response-helpers");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorsMessages = errors.array().map((item) => {
      return { field: item.path, message: item.msg };
    });
    let response = generateResponseWithPayload(
      400,
      false,
      "Invalid data format",
      errorsMessages
    );
    return res.status(400).json(response);
  }
  next();
};

module.exports = validateRequest;
