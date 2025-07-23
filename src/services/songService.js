// src/services/songService.js
const { ObjectId } = require("mongodb");
const databaseConfig = require("../config/database");

class SongService {
  constructor() {
    this.songsCollection = null;
  }

  _getCollection() {
    if (!this.songsCollection) {
      const { songsCollection } = databaseConfig.getDatabase();
      this.songsCollection = songsCollection;
    }
    return this.songsCollection;
  }

  async getAllSongs() {
    const collection = this._getCollection();
    return await collection.find({}).toArray();
  }

  async getSongById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID de canción inválido");
    }

    const collection = this._getCollection();
    const song = await collection.findOne({ _id: new ObjectId(id) });

    if (!song) {
      throw new Error("Canción no encontrada");
    }

    return song;
  }

  async createSong(songData) {
    const { name, path, plays = 0 } = songData;

    // Validaciones
    if (!name || !path) {
      throw new Error('Los campos "name" y "path" son requeridos');
    }

    if (typeof plays !== "number" || plays < 0) {
      throw new Error('El campo "plays" debe ser un número mayor o igual a 0');
    }

    const collection = this._getCollection();

    // Verificar duplicados
    const existingSong = await collection.findOne({ name: name.trim() });
    if (existingSong) {
      throw new Error("Ya existe una canción con ese nombre");
    }

    // Crear objeto de canción
    const newSong = {
      name: name.trim(),
      path: path.trim(),
      plays: parseInt(plays),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertar en BD
    const result = await collection.insertOne(newSong);

    // Retornar canción creada
    return await collection.findOne({ _id: result.insertedId });
  }

  async updateSong(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID de canción inválido");
    }

    const { name, path, plays } = updateData;
    const collection = this._getCollection();

    // Verificar que existe
    const existingSong = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingSong) {
      throw new Error("Canción no encontrada");
    }

    // Validaciones para actualización completa
    if (!name || !path) {
      throw new Error('Los campos "name" y "path" son requeridos');
    }

    if (plays !== undefined && (typeof plays !== "number" || plays < 0)) {
      throw new Error('El campo "plays" debe ser un número mayor o igual a 0');
    }

    // Verificar nombre duplicado
    const duplicateName = await collection.findOne({
      name: name.trim(),
      _id: { $ne: new ObjectId(id) },
    });
    if (duplicateName) {
      throw new Error("Ya existe otra canción con ese nombre");
    }

    // Preparar datos de actualización
    const updateFields = {
      name: name.trim(),
      path: path.trim(),
      plays: plays !== undefined ? parseInt(plays) : existingSong.plays,
      updatedAt: new Date(),
    };

    // Actualizar
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    // Retornar canción actualizada
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async updateSongPartial(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID de canción inválido");
    }

    const collection = this._getCollection();

    // Verificar que existe
    const existingSong = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingSong) {
      throw new Error("Canción no encontrada");
    }

    const updateFields = { updatedAt: new Date() };
    const { name, path, plays } = updateData;

    // Validar y agregar campos a actualizar
    if (name !== undefined) {
      if (!name.trim()) {
        throw new Error('El campo "name" no puede estar vacío');
      }

      // Verificar duplicados
      const duplicateName = await collection.findOne({
        name: name.trim(),
        _id: { $ne: new ObjectId(id) },
      });
      if (duplicateName) {
        throw new Error("Ya existe otra canción con ese nombre");
      }

      updateFields.name = name.trim();
    }

    if (path !== undefined) {
      if (!path.trim()) {
        throw new Error('El campo "path" no puede estar vacío');
      }
      updateFields.path = path.trim();
    }

    if (plays !== undefined) {
      if (typeof plays !== "number" || plays < 0) {
        throw new Error(
          'El campo "plays" debe ser un número mayor o igual a 0'
        );
      }
      updateFields.plays = parseInt(plays);
    }

    // Actualizar
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    // Retornar canción actualizada
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async deleteSong(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error("ID de canción inválido");
    }

    const collection = this._getCollection();

    // Verificar que existe
    const existingSong = await collection.findOne({ _id: new ObjectId(id) });
    if (!existingSong) {
      throw new Error("Canción no encontrada");
    }

    // Eliminar
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return {
      deletedSong: existingSong,
      deletedCount: result.deletedCount,
    };
  }
}

// Exportar instancia única
module.exports = new SongService();
