const errorMiddleware = (error, req, res, next) => {
  console.log("Unhandled Error caught by error middleware:", error);
  req.statusCode = req.statusCode || 500;
  req.message = req.message || "Something went wrong";

  res.status(req.statusCode).json({
    success: false,
    message: req.message,
    stack: error.stack,
  });
};

export default errorMiddleware;
