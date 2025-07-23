// src/controllers/songController.js
const songService = require("../services/songService");

class SongController {
  // GET - Obtener todas las canciones
  async getAllSongs(req, res) {
    try {
      console.log("📋 Obteniendo todas las canciones...");

      const songs = await songService.getAllSongs();
      console.log(`✅ Se encontraron ${songs.length} canciones`);

      res.json({
        success: true,
        count: songs.length,
        data: songs,
      });
    } catch (error) {
      console.error("❌ Error al obtener canciones:", error);
      res.status(500).json({
        success: false,
        error: "Error al obtener las canciones",
      });
    }
  }

  // GET - Obtener una canción por ID
  async getSongById(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔍 Buscando canción con ID: ${id}`);

      const song = await songService.getSongById(id);

      console.log("✅ Canción encontrada:", song.name);
      res.json({
        success: true,
        data: song,
      });
    } catch (error) {
      console.error("❌ Error al obtener canción:", error);

      if (error.message === "ID de canción inválido") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Canción no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error al obtener la canción",
      });
    }
  }

  // POST - Crear una nueva canción
  async createSong(req, res) {
    try {
      console.log("📝 Creando nueva canción...");
      console.log("Body recibido:", req.body);

      const createdSong = await songService.createSong(req.body);

      console.log("✅ Canción creada exitosamente:", createdSong.name);
      res.status(201).json({
        success: true,
        message: "Canción creada exitosamente",
        data: createdSong,
      });
    } catch (error) {
      console.error("❌ Error al crear canción:", error);

      if (
        error.message.includes("requeridos") ||
        error.message.includes("debe ser un número") ||
        error.message.includes("Ya existe una canción")
      ) {
        const statusCode = error.message.includes("Ya existe") ? 409 : 400;
        return res.status(statusCode).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error al crear la canción",
      });
    }
  }

  // PUT - Actualizar una canción completa
  async updateSong(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔄 Actualizando canción con ID: ${id}`);

      const updatedSong = await songService.updateSong(id, req.body);

      console.log("✅ Canción actualizada exitosamente:", updatedSong.name);
      res.json({
        success: true,
        message: "Canción actualizada exitosamente",
        data: updatedSong,
      });
    } catch (error) {
      console.error("❌ Error al actualizar canción:", error);

      if (
        error.message === "ID de canción inválido" ||
        error.message.includes("requeridos") ||
        error.message.includes("debe ser un número")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Canción no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message.includes("Ya existe otra canción")) {
        return res.status(409).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error al actualizar la canción",
      });
    }
  }

  // PATCH - Actualizar parcialmente una canción
  async updateSongPartial(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔄 Actualizando parcialmente canción con ID: ${id}`);

      const updatedSong = await songService.updateSongPartial(id, req.body);

      console.log("✅ Canción actualizada parcialmente:", updatedSong.name);
      res.json({
        success: true,
        message: "Canción actualizada exitosamente",
        data: updatedSong,
      });
    } catch (error) {
      console.error("❌ Error al actualizar canción:", error);

      if (
        error.message === "ID de canción inválido" ||
        error.message.includes("no puede estar vacío") ||
        error.message.includes("debe ser un número")
      ) {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Canción no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message.includes("Ya existe otra canción")) {
        return res.status(409).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error al actualizar la canción",
      });
    }
  }

  // DELETE - Eliminar una canción
  async deleteSong(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ Eliminando canción con ID: ${id}`);

      const result = await songService.deleteSong(id);

      console.log(
        `✅ Canción "${result.deletedSong.name}" eliminada exitosamente`
      );
      res.json({
        success: true,
        message: "Canción eliminada exitosamente",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error al eliminar canción:", error);

      if (error.message === "ID de canción inválido") {
        return res.status(400).json({
          success: false,
          error: error.message,
        });
      }

      if (error.message === "Canción no encontrada") {
        return res.status(404).json({
          success: false,
          error: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: "Error al eliminar la canción",
      });
    }
  }
}

module.exports = new SongController();
