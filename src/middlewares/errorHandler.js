import errorAnalize from "../lib/errorAnalize.js";
const errorHandler = (err, req, res, next) => {
  const truncatedStack = err.stack ? err.stack.split("\n")[0] : null;
  console.log("🔥 Error:", truncatedStack || err.message);

  res.status(err.status || 500).json({
    success: false,
    massage:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : errorAnalize(err.message), //not massage
    stack: process.env.NODE_ENV === "production" ? null : truncatedStack,
  });
};

export default errorHandler;
