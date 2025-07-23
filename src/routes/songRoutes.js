// src/routes/songRoutes.js
const express = require("express");
const songController = require("../controllers/songController");
const { checkConnection } = require("../middleware/checkConnection");

const router = express.Router();

// Aplicar middleware de conexión a todas las rutas
router.use(checkConnection);

// Definir rutas CRUD
router.get("/", songController.getAllSongs);
router.get("/:id", songController.getSongById);
router.post("/", songController.createSong);
router.put("/:id", songController.updateSong);
router.patch("/:id", songController.updateSongPartial);
router.delete("/:id", songController.deleteSong);

module.exports = router;
