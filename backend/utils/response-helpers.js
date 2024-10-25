exports.generateResponseWithPayload = (status, success, message, payload) => {
  return {
    status,
    success,
    message,
    data: payload,
  };
};

exports.generateResponseWithoutPayload = (status, success, message) => {
  return {
    status,
    success,
    message,
  };
};
