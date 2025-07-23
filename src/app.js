// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importar middleware
const { requestLogger } = require("./middleware/requestLogger");
const { errorHandler } = require("./middleware/errorHandler");

// Importar rutas
const apiRoutes = require("./routes/index");

const app = express();

// Middleware global
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// Rutas principales
app.use("/api", apiRoutes);

// Página de inicio
app.get("/", (req, res) => {
  res.json({
    message: "🎵 Microservicio CRUD Canciones - Refactorizado",
    version: "2.0.0",
    status: "Funcionando correctamente",
    architecture: "Estructura profesional implementada",
    documentation: {
      endpoints: "/api",
      health: "/api/health",
      songs: "/api/songs"
    },
    developer: "Darío Rodríguez",
    course: "Desarrollo Web Avanzado"
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado",
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
    availableEndpoints: {
      "GET /": "Información del microservicio",
      "GET /api": "Información de la API",
      "GET /api/health": "Estado del servicio",
      "GET /api/songs": "Gestión de canciones"
    }
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
