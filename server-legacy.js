require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Middleware de logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] ${req.method} ${req.path} - Content-Type: ${req.headers["content-type"]}`
  );
  next();
});

// Variables para la conexión a MongoDB
let db;
let songsCollection;

// Función para conectar a MongoDB
async function connectToMongoDB() {
  try {
    console.log("🔄 Conectando a MongoDB...");
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    // Seleccionar la base de datos
    db = client.db("canciones_db");
    songsCollection = db.collection("songs");

    console.log("✅ Conectado exitosamente a MongoDB");
    console.log("📁 Base de datos:", db.databaseName);

    // Crear índice único para optimizar consultas (opcional)
    await songsCollection.createIndex({ name: 1 });
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);
  }
}

// Middleware para verificar conexión a BD
const checkConnection = (req, res, next) => {
  if (!db) {
    return res.status(500).json({
      error: "Error de conexión a la base de datos",
    });
  }
  next();
};

// ENDPOINTS DEL CRUD

// GET - Obtener todas las canciones
app.get("/api/songs", checkConnection, async (req, res) => {
  try {
    console.log("📋 Obteniendo todas las canciones...");
    const songs = await songsCollection.find({}).toArray();
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
});

// GET - Obtener una canción por ID
app.get("/api/songs/:id", checkConnection, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando canción con ID: ${id}`);

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de canción inválido",
      });
    }

    const song = await songsCollection.findOne({ _id: new ObjectId(id) });

    if (!song) {
      return res.status(404).json({
        success: false,
        error: "Canción no encontrada",
      });
    }

    console.log("✅ Canción encontrada:", song.name);
    res.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("❌ Error al obtener canción:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener la canción",
    });
  }
});

// POST - Crear una nueva canción
app.post("/api/songs", checkConnection, async (req, res) => {
  try {
    console.log("📝 Creando nueva canción...");
    console.log("Body recibido:", req.body);

    const { name, path, plays = 0 } = req.body;

    // Validaciones
    if (!name || !path) {
      return res.status(400).json({
        success: false,
        error: 'Los campos "name" y "path" son requeridos',
      });
    }

    if (typeof plays !== "number" || plays < 0) {
      return res.status(400).json({
        success: false,
        error: 'El campo "plays" debe ser un número mayor o igual a 0',
      });
    }

    // Verificar si ya existe una canción con el mismo nombre
    const existingSong = await songsCollection.findOne({ name });
    if (existingSong) {
      return res.status(409).json({
        success: false,
        error: "Ya existe una canción con ese nombre",
      });
    }

    // Crear el objeto de la canción
    const newSong = {
      name: name.trim(),
      path: path.trim(),
      plays: parseInt(plays),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertar en la base de datos
    const result = await songsCollection.insertOne(newSong);

    // Obtener la canción creada con su ID
    const createdSong = await songsCollection.findOne({
      _id: result.insertedId,
    });

    console.log("✅ Canción creada exitosamente:", createdSong.name);
    res.status(201).json({
      success: true,
      message: "Canción creada exitosamente",
      data: createdSong,
    });
  } catch (error) {
    console.error("❌ Error al crear canción:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear la canción",
    });
  }
});

// PUT - Actualizar una canción completa
app.put("/api/songs/:id", checkConnection, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Actualizando canción con ID: ${id}`);

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de canción inválido",
      });
    }

    const { name, path, plays } = req.body;

    // Validaciones
    if (!name || !path) {
      return res.status(400).json({
        success: false,
        error: 'Los campos "name" y "path" son requeridos',
      });
    }

    if (plays !== undefined && (typeof plays !== "number" || plays < 0)) {
      return res.status(400).json({
        success: false,
        error: 'El campo "plays" debe ser un número mayor o igual a 0',
      });
    }

    // Verificar que la canción existe
    const existingSong = await songsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSong) {
      return res.status(404).json({
        success: false,
        error: "Canción no encontrada",
      });
    }

    // Verificar si el nuevo nombre ya existe en otra canción
    const duplicateName = await songsCollection.findOne({
      name: name.trim(),
      _id: { $ne: new ObjectId(id) },
    });
    if (duplicateName) {
      return res.status(409).json({
        success: false,
        error: "Ya existe otra canción con ese nombre",
      });
    }

    // Actualizar la canción
    const updateData = {
      name: name.trim(),
      path: path.trim(),
      plays: plays !== undefined ? parseInt(plays) : existingSong.plays,
      updatedAt: new Date(),
    };

    const result = await songsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Obtener la canción actualizada
    const updatedSong = await songsCollection.findOne({
      _id: new ObjectId(id),
    });

    console.log("✅ Canción actualizada exitosamente:", updatedSong.name);
    res.json({
      success: true,
      message: "Canción actualizada exitosamente",
      data: updatedSong,
    });
  } catch (error) {
    console.error("❌ Error al actualizar canción:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la canción",
    });
  }
});

// PATCH - Actualizar parcialmente una canción
app.patch("/api/songs/:id", checkConnection, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Actualizando parcialmente canción con ID: ${id}`);

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de canción inválido",
      });
    }

    // Verificar que la canción existe
    const existingSong = await songsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSong) {
      return res.status(404).json({
        success: false,
        error: "Canción no encontrada",
      });
    }

    const updateData = { updatedAt: new Date() };
    const { name, path, plays } = req.body;

    // Validar y agregar campos que se van a actualizar
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El campo "name" no puede estar vacío',
        });
      }

      // Verificar si el nuevo nombre ya existe en otra canción
      const duplicateName = await songsCollection.findOne({
        name: name.trim(),
        _id: { $ne: new ObjectId(id) },
      });
      if (duplicateName) {
        return res.status(409).json({
          success: false,
          error: "Ya existe otra canción con ese nombre",
        });
      }

      updateData.name = name.trim();
    }

    if (path !== undefined) {
      if (!path.trim()) {
        return res.status(400).json({
          success: false,
          error: 'El campo "path" no puede estar vacío',
        });
      }
      updateData.path = path.trim();
    }

    if (plays !== undefined) {
      if (typeof plays !== "number" || plays < 0) {
        return res.status(400).json({
          success: false,
          error: 'El campo "plays" debe ser un número mayor o igual a 0',
        });
      }
      updateData.plays = parseInt(plays);
    }

    // Actualizar la canción
    await songsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Obtener la canción actualizada
    const updatedSong = await songsCollection.findOne({
      _id: new ObjectId(id),
    });

    console.log("✅ Canción actualizada parcialmente:", updatedSong.name);
    res.json({
      success: true,
      message: "Canción actualizada exitosamente",
      data: updatedSong,
    });
  } catch (error) {
    console.error("❌ Error al actualizar canción:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar la canción",
    });
  }
});

// DELETE - Eliminar una canción
app.delete("/api/songs/:id", checkConnection, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Eliminando canción con ID: ${id}`);

    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de canción inválido",
      });
    }

    // Verificar que la canción existe antes de eliminar
    const existingSong = await songsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!existingSong) {
      return res.status(404).json({
        success: false,
        error: "Canción no encontrada",
      });
    }

    // Eliminar la canción
    const result = await songsCollection.deleteOne({ _id: new ObjectId(id) });

    console.log(`✅ Canción "${existingSong.name}" eliminada exitosamente`);
    res.json({
      success: true,
      message: "Canción eliminada exitosamente",
      data: {
        deletedSong: existingSong,
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("❌ Error al eliminar canción:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar la canción",
    });
  }
});

// Endpoint de salud
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Microservicio funcionando correctamente",
    timestamp: new Date().toISOString(),
    database: db ? "Conectado" : "Desconectado",
  });
});

// Endpoint de información
app.get("/", (req, res) => {
  res.json({
    message: "Microservicio CRUD Canciones",
    version: "1.0.0",
    endpoints: {
      "GET /api/songs": "Obtener todas las canciones",
      "GET /api/songs/:id": "Obtener una canción por ID",
      "POST /api/songs": "Crear una nueva canción",
      "PUT /api/songs/:id": "Actualizar una canción completa",
      "PATCH /api/songs/:id": "Actualizar parcialmente una canción",
      "DELETE /api/songs/:id": "Eliminar una canción",
      "GET /health": "Estado del servicio",
    },
    documentation: "Envía peticiones con Content-Type: application/json",
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint no encontrado",
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error("❌ Error no manejado:", error);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
});

// Función para iniciar el servidor
async function startServer() {
  try {
    // Conectar a MongoDB primero
    await connectToMongoDB();

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log("🚀 ======================================");
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log("🚀 ======================================");
      console.log(`📊 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`💾 Base de datos: MongoDB Atlas`);
      console.log(`📁 Colección: songs`);
      console.log("🚀 ======================================");
      console.log("📋 Endpoints disponibles:");
      console.log("   GET    /                  - Información del API");
      console.log("   GET    /health            - Estado del servicio");
      console.log("   GET    /api/songs         - Obtener todas las canciones");
      console.log("   GET    /api/songs/:id     - Obtener canción por ID");
      console.log("   POST   /api/songs         - Crear nueva canción");
      console.log("   PUT    /api/songs/:id     - Actualizar canción completa");
      console.log("   PATCH  /api/songs/:id     - Actualizar canción parcial");
      console.log("   DELETE /api/songs/:id     - Eliminar canción");
      console.log("🚀 ======================================");
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on("SIGINT", () => {
  console.log("\n🛑 Cerrando servidor...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Cerrando servidor...");
  process.exit(0);
});

// Iniciar la aplicación
startServer();
