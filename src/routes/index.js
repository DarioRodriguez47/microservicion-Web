// src/routes/index.js
const express = require("express");
const songRoutes = require("./songRoutes");
const databaseConfig = require("../config/database");

const router = express.Router();

// Rutas principales
router.use("/songs", songRoutes);

// Health check
router.get("/health", (req, res) => {
  const { db } = databaseConfig.getDatabase();
  res.json({
    success: true,
    message: "Microservicio funcionando correctamente",
    timestamp: new Date().toISOString(),
    database: db ? "Conectado" : "Desconectado",
  });
});

// Información del API
router.get("/", (req, res) => {
  res.json({
    message: "Microservicio CRUD Canciones",
    version: "2.0.0",
    architecture: "Refactorizada con estructura profesional",
    endpoints: {
      "GET /api/songs": "Obtener todas las canciones",
      "GET /api/songs/:id": "Obtener una canción por ID",
      "POST /api/songs": "Crear una nueva canción",
      "PUT /api/songs/:id": "Actualizar una canción completa",
      "PATCH /api/songs/:id": "Actualizar parcialmente una canción",
      "DELETE /api/songs/:id": "Eliminar una canción",
      "GET /api/health": "Estado del servicio",
    },
    documentation: "Envía peticiones con Content-Type: application/json",
  });
});

module.exports = router;
