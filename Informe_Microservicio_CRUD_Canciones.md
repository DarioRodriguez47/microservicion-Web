# INFORME DE PRÁCTICA: MICROSERVICIO CRUD CANCIONES

## INFORMACIÓN GENERAL

**Materia:** Desarrollo Web Avanzado  
**Práctica:** Microservicio con CRUD Canciones  
**Estudiante:** Darío Rodríguez  
**Fecha:** 23 de Julio de 2025  
**Repositorio:** https://github.com/DarioRodriguez47/microservicion-Web  
**URL Desplegada:** https://microservicion-web.onrender.com

---

## 1. OBJETIVOS

### Objetivo General

Desarrollar un microservicio completo con operaciones CRUD para la gestión de canciones, utilizando tecnologías modernas de desarrollo web y despliegue en la nube.

### Objetivos Específicos

- Implementar un API REST con operaciones CRUD completas
- Integrar MongoDB Atlas como base de datos en la nube
- Configurar un entorno de desarrollo con Node.js y Express
- Desplegar la aplicación en una plataforma cloud (Render.com)
- Realizar pruebas de funcionamiento con herramientas como Postman
- Implementar mejores prácticas de desarrollo y documentación

---

## 2. TECNOLOGÍAS UTILIZADAS

### Backend

- **Node.js v18+**: Entorno de ejecución de JavaScript
- **Express.js v4.18.2**: Framework web minimalista para Node.js
- **MongoDB Driver v6.18.0**: Cliente oficial para conexión con MongoDB

### Base de Datos

- **MongoDB Atlas**: Base de datos NoSQL en la nube
- **Cluster:** Cluster0.vw5pr.mongodb.net
- **Base de datos:** canciones_db
- **Colección:** songs

### Herramientas de Desarrollo

- **dotenv v16.3.1**: Gestión de variables de entorno
- **cors v2.8.5**: Middleware para permitir Cross-Origin Resource Sharing
- **nodemon v3.0.1**: Herramienta de desarrollo para reinicio automático

### Despliegue y Control de Versiones

- **Git**: Control de versiones
- **GitHub**: Repositorio remoto
- **Render.com**: Plataforma de despliegue cloud

---

## 3. ARQUITECTURA DEL PROYECTO

### Estructura de Archivos

```
microservicio-canciones/
├── server.js                    # Servidor principal con MongoDB
├── package.json                 # Configuración del proyecto
├── .env                        # Variables de entorno
├── .gitignore                  # Archivos excluidos de Git
├── README.md                   # Documentación
├── postman_collection.json     # Colección de pruebas
└── render-deployment-variables.txt # Variables de despliegue
```

### Arquitectura de Software

- **Patrón:** API REST
- **Arquitectura:** Microservicio monolítico
- **Comunicación:** HTTP/JSON
- **Middleware:** Express.js con CORS y logging personalizado

---

## 4. IMPLEMENTACIÓN

### 4.1 Configuración del Servidor

El servidor principal (`server.js`) implementa:

#### Configuración Básica

```javascript
require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
```

#### Middleware Implementado

- **JSON Parser**: Para manejar peticiones con contenido JSON
- **CORS**: Para permitir peticiones desde diferentes orígenes
- **Logging personalizado**: Para registrar todas las peticiones HTTP

#### Conexión a Base de Datos

```javascript
async function connectToMongoDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db("canciones_db");
  songsCollection = db.collection("songs");
}
```

### 4.2 Endpoints Implementados

#### 1. Health Check

- **Endpoint:** `GET /health`
- **Propósito:** Verificar estado del servicio
- **Respuesta:** Status de la aplicación y base de datos

#### 2. Obtener Todas las Canciones

- **Endpoint:** `GET /api/songs`
- **Función:** Listar todas las canciones con paginación opcional
- **Parámetros opcionales:** page, limit
- **Respuesta:** Array de canciones con metadatos

#### 3. Obtener Canción por ID

- **Endpoint:** `GET /api/songs/:id`
- **Función:** Obtener una canción específica
- **Validación:** ObjectId válido de MongoDB
- **Respuesta:** Objeto de canción o error 404

#### 4. Crear Nueva Canción

- **Endpoint:** `POST /api/songs`
- **Función:** Crear una nueva canción
- **Validaciones:**
  - Campos requeridos (name, artist)
  - Tipos de datos correctos
- **Respuesta:** Canción creada con ID generado

#### 5. Actualizar Canción Completa

- **Endpoint:** `PUT /api/songs/:id`
- **Función:** Actualización completa de una canción
- **Validaciones:** Todos los campos requeridos
- **Respuesta:** Canción actualizada

#### 6. Actualizar Canción Parcial

- **Endpoint:** `PATCH /api/songs/:id`
- **Función:** Actualización parcial de campos
- **Validaciones:** Al menos un campo para actualizar
- **Respuesta:** Canción actualizada

#### 7. Eliminar Canción

- **Endpoint:** `DELETE /api/songs/:id`
- **Función:** Eliminar una canción por ID
- **Validación:** Existencia de la canción
- **Respuesta:** Confirmación de eliminación

### 4.3 Modelo de Datos

#### Estructura de Canción

```javascript
{
  "_id": ObjectId("..."),           // ID único generado por MongoDB
  "name": "String",                 // Nombre de la canción (requerido)
  "artist": "String",               // Artista (requerido)
  "album": "String",                // Álbum (opcional)
  "year": Number,                   // Año de lanzamiento (opcional)
  "genre": "String",                // Género musical (opcional)
  "duration": Number,               // Duración en segundos (opcional)
  "createdAt": Date,                // Fecha de creación
  "updatedAt": Date                 // Fecha de última actualización
}
```

#### Validaciones Implementadas

- **Campos requeridos:** name, artist
- **Tipos de datos:** Validación estricta para year y duration
- **Longitud:** Límites en campos de texto
- **Formato:** Validación de ObjectId para parámetros de ID

---

## 5. BASE DE DATOS

### 5.1 MongoDB Atlas

- **Proveedor:** MongoDB Atlas (Cloud)
- **Tier:** Free Tier (M0)
- **Región:** AWS / us-east-1
- **Cluster:** Cluster0

### 5.2 Configuración de Conexión

```
mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
```

### 5.3 Características Implementadas

- **Creación automática:** Base de datos y colecciones se crean automáticamente
- **Índices:** Índice en campo 'name' para optimización
- **Conexión persistente:** Una conexión reutilizada durante toda la ejecución
- **Manejo de errores:** Gestión robusta de errores de conexión

---

## 6. DESPLIEGUE

### 6.1 Plataforma: Render.com

- **Tipo:** Web Service
- **Plan:** Free Tier
- **Región:** Oregon (US West)
- **URL:** https://microservicion-web.onrender.com

### 6.2 Configuración de Despliegue

#### Variables de Entorno

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=3000
```

#### Comandos de Construcción

- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Auto-deploy:** Habilitado desde rama main

### 6.3 Características del Despliegue

- **Auto-scaling:** Automático según demanda
- **SSL/HTTPS:** Certificado automático
- **Logs:** Acceso completo a logs de aplicación
- **Health Checks:** Monitoreo automático de estado

---

## 7. PRUEBAS Y VALIDACIÓN

### 7.1 Herramientas de Prueba

- **Postman:** Para pruebas de API
- **cURL:** Para pruebas desde línea de comandos
- **Navegador:** Para endpoints GET simples

### 7.2 Escenarios de Prueba Realizados

#### Pruebas Funcionales

1. **Creación de canciones:** Verificación de POST /api/songs
2. **Consulta de canciones:** Validación de GET /api/songs
3. **Búsqueda por ID:** Prueba de GET /api/songs/:id
4. **Actualización completa:** Validación de PUT /api/songs/:id
5. **Actualización parcial:** Prueba de PATCH /api/songs/:id
6. **Eliminación:** Verificación de DELETE /api/songs/:id

#### Pruebas de Validación

1. **Campos requeridos:** Verificación de errores 400
2. **IDs inválidos:** Validación de errores 400
3. **Recursos no encontrados:** Verificación de errores 404
4. **Tipos de datos incorrectos:** Validación de errores de formato

#### Pruebas de Integración

1. **Conexión a base de datos:** Verificación de conectividad
2. **Health check:** Validación de endpoint /health
3. **CORS:** Pruebas de cross-origin requests
4. **Logging:** Verificación de registro de peticiones

### 7.3 Resultados de Pruebas

- ✅ **Todas las operaciones CRUD funcionando correctamente**
- ✅ **Validaciones de entrada operativas**
- ✅ **Manejo de errores implementado**
- ✅ **Integración con MongoDB Atlas exitosa**
- ✅ **Despliegue en producción funcional**

---

## 8. DOCUMENTACIÓN DE API

### 8.1 Base URL

```
Desarrollo: http://localhost:3000
Producción: https://microservicion-web.onrender.com
```

### 8.2 Endpoints Detallados

#### GET /health

**Propósito:** Health check del servicio

```javascript
// Respuesta exitosa
{
  "status": "OK",
  "timestamp": "2025-07-23T22:38:00.000Z",
  "database": "Connected",
  "version": "1.0.0"
}
```

#### GET /api/songs

**Propósito:** Obtener lista de canciones
**Parámetros query opcionales:**

- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

```javascript
// Respuesta exitosa
{
  "songs": [
    {
      "_id": "64a1b2c3d4e5f6789012345",
      "name": "Bohemian Rhapsody",
      "artist": "Queen",
      "album": "A Night at the Opera",
      "year": 1975,
      "genre": "Rock",
      "duration": 355
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalSongs": 45
}
```

#### POST /api/songs

**Propósito:** Crear nueva canción
**Body requerido:**

```javascript
{
  "name": "string (requerido)",
  "artist": "string (requerido)",
  "album": "string (opcional)",
  "year": "number (opcional)",
  "genre": "string (opcional)",
  "duration": "number (opcional)"
}
```

#### PUT /api/songs/:id

**Propósito:** Actualizar canción completa
**Parámetros:** `id` - ObjectId de MongoDB
**Body:** Todos los campos requeridos

#### PATCH /api/songs/:id

**Propósito:** Actualizar canción parcialmente
**Parámetros:** `id` - ObjectId de MongoDB
**Body:** Al menos un campo para actualizar

#### DELETE /api/songs/:id

**Propósito:** Eliminar canción
**Parámetros:** `id` - ObjectId de MongoDB

```javascript
// Respuesta exitosa
{
  "message": "Canción eliminada exitosamente",
  "deletedSong": { /* objeto eliminado */ }
}
```

---

## 9. CONTROL DE VERSIONES

### 9.1 Repositorio Git

- **Plataforma:** GitHub
- **URL:** https://github.com/DarioRodriguez47/microservicion-Web
- **Rama principal:** main
- **Commits:** 3 commits principales

### 9.2 Historial de Commits

1. **Initial commit:** Configuración inicial del proyecto
2. **Add complete CRUD operations:** Implementación de todas las operaciones
3. **Microservicio CRUD Canciones completo:** Versión final con documentación

### 9.3 Archivos Ignorados (.gitignore)

```
node_modules/
.env
.DS_Store
*.log
```

---

## 10. CONSIDERACIONES DE SEGURIDAD

### 10.1 Variables de Entorno

- **Credenciales:** Almacenadas en variables de entorno
- **MongoDB URI:** No expuesta en código fuente
- **Configuración:** Separada por entornos (desarrollo/producción)

### 10.2 Validación de Entrada

- **Sanitización:** Validación de tipos de datos
- **Prevención de inyección:** Uso del driver oficial de MongoDB
- **Validación de ObjectId:** Verificación de formato antes de consultas

### 10.3 CORS

- **Configuración:** Habilitado para todas las rutas
- **Flexibilidad:** Permite desarrollo desde localhost
- **Producción:** Configuración adecuada para entorno real

---

## 11. OPTIMIZACIONES IMPLEMENTADAS

### 11.1 Base de Datos

- **Índices:** Creación de índice en campo 'name'
- **Conexión:** Reutilización de conexión única
- **Paginación:** Implementada para consultas masivas

### 11.2 Aplicación

- **Middleware:** Logging eficiente de peticiones
- **Validaciones:** Verificación temprana de datos
- **Manejo de errores:** Respuestas consistentes y útiles

### 11.3 Despliegue

- **Auto-deploy:** Actualización automática desde Git
- **Health checks:** Monitoreo de estado de aplicación
- **Logging:** Acceso completo a logs para debugging

---

## 12. LIMITACIONES Y MEJORAS FUTURAS

### 12.1 Limitaciones Actuales

- **Autenticación:** No implementada (apropiado para práctica académica)
- **Rate limiting:** No configurado
- **Caching:** No implementado
- **Tests automatizados:** No incluidos

### 12.2 Mejoras Propuestas

1. **Autenticación y autorización** con JWT
2. **Tests unitarios e integración** con Jest
3. **Rate limiting** para prevenir abuso
4. **Caching** con Redis para mejor performance
5. **Documentación automática** con Swagger
6. **Logging estructurado** con Winston
7. **Monitoring** con métricas de performance

---

## 13. CONCLUSIONES

### 13.1 Objetivos Cumplidos

✅ **Microservicio CRUD completo:** Todas las operaciones implementadas correctamente  
✅ **Integración con MongoDB Atlas:** Conexión y operaciones exitosas  
✅ **Despliegue en la nube:** Aplicación funcionando en Render.com  
✅ **API REST funcional:** Endpoints bien estructurados y documentados  
✅ **Manejo de errores:** Respuestas apropiadas para todos los casos  
✅ **Documentación completa:** README y documentación de API

### 13.2 Aprendizajes Obtenidos

- **Desarrollo de APIs REST** con Node.js y Express
- **Integración con bases de datos NoSQL** (MongoDB)
- **Despliegue en plataformas cloud** (Render.com)
- **Mejores prácticas** en estructura de proyectos
- **Control de versiones** con Git y GitHub
- **Configuración de entornos** de desarrollo y producción

### 13.3 Valor Académico

Esta práctica demostró la capacidad de:

- Desarrollar un microservicio completo desde cero
- Integrar múltiples tecnologías modernas
- Implementar operaciones CRUD robustas
- Desplegar aplicaciones en entornos de producción
- Documentar apropiadamente el desarrollo

### 13.4 Aplicabilidad Profesional

El proyecto desarrollado representa un caso de uso real en el desarrollo de software moderno, utilizando:

- **Arquitectura de microservicios**
- **Bases de datos en la nube**
- **Despliegue continuo**
- **APIs RESTful**
- **Mejores prácticas de desarrollo**

---

## 14. ANEXOS

### Anexo A: Colección de Postman

La colección completa de pruebas está disponible en:
`postman_collection.json`

### Anexo B: Variables de Entorno

Archivo con configuración completa:
`render-deployment-variables.txt`

### Anexo C: Logs de Despliegue

Logs completos del proceso de despliegue en Render.com disponibles en la plataforma.

---

**Fin del Informe**

_Fecha de elaboración: 23 de Julio de 2025_  
_Tiempo total de desarrollo: Aproximadamente 4 horas_  
_Estado del proyecto: Completado y desplegado exitosamente_
