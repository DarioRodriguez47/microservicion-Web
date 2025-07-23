// src/config/database.js
const { MongoClient } = require("mongodb");

class DatabaseConfig {
  constructor() {
    this.client = null;
    this.db = null;
    this.songsCollection = null;
  }

  async connect() {
    try {
      console.log("🔄 Conectando a MongoDB...");
      
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();

      // Seleccionar la base de datos
      this.db = this.client.db("canciones_db");
      this.songsCollection = this.db.collection("songs");

      console.log("✅ Conectado exitosamente a MongoDB");
      console.log("📁 Base de datos:", this.db.databaseName);

      // Crear índice para optimizar consultas
      await this.songsCollection.createIndex({ name: 1 });
      
      return { db: this.db, songsCollection: this.songsCollection };
    } catch (error) {
      console.error("❌ Error al conectar con MongoDB:", error);
      process.exit(1);
    }
  }

  getDatabase() {
    return {
      db: this.db,
      songsCollection: this.songsCollection
    };
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log("🔌 Desconectado de MongoDB");
    }
  }
}

// Crear instancia única (Singleton)
const databaseConfig = new DatabaseConfig();

module.exports = databaseConfig;
