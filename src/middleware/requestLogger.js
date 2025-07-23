// src/middleware/requestLogger.js
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] ${req.method} ${req.path} - Content-Type: ${req.headers["content-type"]}`
  );
  next();
};

module.exports = { requestLogger };
