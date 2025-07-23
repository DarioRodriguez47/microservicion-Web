// src/middleware/checkConnection.js
const databaseConfig = require("../config/database");

const checkConnection = (req, res, next) => {
  const { db } = databaseConfig.getDatabase();
  
  if (!db) {
    return res.status(500).json({
      success: false,
      error: "Error de conexión a la base de datos",
    });
  }
  
  next();
};

module.exports = { checkConnection };
