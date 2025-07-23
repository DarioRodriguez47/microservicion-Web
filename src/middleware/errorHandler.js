// src/middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  console.error("❌ Error no manejado:", error);
  
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};

module.exports = { errorHandler };
