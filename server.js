// server-refactored.js
const app = require("./src/app");
const databaseConfig = require("./src/config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Conectar a MongoDB
    await databaseConfig.connect();

    // Iniciar servidor Express
    app.listen(PORT, () => {
      console.log("🚀 ======================================");
      console.log("🎵 MICROSERVICIO CRUD CANCIONES v2.0");
      console.log("🚀 ======================================");
      console.log(`🚀 Servidor: http://localhost:${PORT}`);
      console.log(`📊 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`💾 Base de datos: MongoDB Atlas`);
      console.log(`📁 Colección: songs`);
      console.log("🏗️ Arquitectura: Refactorizada y profesional");
      console.log("🚀 ======================================");
      console.log("📋 Endpoints principales:");
      console.log("   GET    /                    - Info del microservicio");
      console.log("   GET    /api                 - Info de la API");
      console.log("   GET    /api/health          - Estado del servicio");
      console.log("   GET    /api/songs           - Gestión de canciones");
      console.log("🚀 ======================================");
      console.log("✨ Estructura implementada:");
      console.log("   📁 src/config/             - Configuraciones");
      console.log("   📁 src/controllers/        - Lógica de controladores");
      console.log("   📁 src/services/           - Lógica de negocio");
      console.log("   📁 src/routes/             - Definición de rutas");
      console.log("   📁 src/middleware/         - Middleware personalizado");
      console.log("🚀 ======================================");
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on("SIGINT", async () => {
  console.log("\n🛑 Cerrando servidor...");
  await databaseConfig.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Cerrando servidor...");
  await databaseConfig.disconnect();
  process.exit(0);
});

// Iniciar la aplicación
startServer();
