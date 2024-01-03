const errorHandler = (err, req, res, next) => {
  console.error(500);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
