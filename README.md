# Microservicio CRUD Canciones

## Descripción

Microservicio desarrollado con Node.js y Express para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre una tabla de canciones utilizando MongoDB Atlas como base de datos.

## Tecnologías Utilizadas

- **Lenguaje**: JavaScript (Node.js)
- **Framework**: Express.js
- **Base de datos**: MongoDB Atlas
- **Dependencias principales**:
  - express: Framework web para Node.js
  - mongodb: Driver oficial de MongoDB para Node.js
  - dotenv: Manejo de variables de entorno
  - cors: Middleware para permitir CORS
  - nodemon: Herramienta de desarrollo para reinicio automático

## Estructura del Proyecto

```
microservicio-canciones/
├── server.js              # Archivo principal del servidor
├── server-simple.js       # Versión simple con datos en memoria
├── package.json           # Configuración del proyecto y dependencias
├── .env                   # Variables de entorno
├── .gitignore            # Archivos a ignorar en Git
└── README.md             # Documentación del proyecto
```

## Configuración

### Variables de Entorno (.env)

```env
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
NODE_ENV=development
APP_NAME=Microservicio Canciones
APP_VERSION=1.0.0
```

### Instalación

```bash
# Clonar o descargar el proyecto
cd microservicio-canciones

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en modo producción
npm start
```

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Endpoints Disponibles

#### 1. GET / - Información del API

```http
GET /
```

**Respuesta**: Información general del microservicio y endpoints disponibles.

#### 2. GET /health - Estado del servicio

```http
GET /health
```

**Respuesta**: Estado de salud del microservicio y conexión a la base de datos.

#### 3. GET /api/songs - Obtener todas las canciones

```http
GET /api/songs
```

**Respuesta**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f8a2b5c9e8b1234567890a",
      "name": "Bohemian Rhapsody",
      "path": "/music/queen/bohemian-rhapsody.mp3",
      "plays": 1500,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

#### 4. GET /api/songs/:id - Obtener canción por ID

```http
GET /api/songs/64f8a2b5c9e8b1234567890a
```

**Respuesta**:

```json
{
  "success": true,
  "data": {
    "_id": "64f8a2b5c9e8b1234567890a",
    "name": "Bohemian Rhapsody",
    "path": "/music/queen/bohemian-rhapsody.mp3",
    "plays": 1500,
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

#### 5. POST /api/songs - Crear nueva canción

```http
POST /api/songs
Content-Type: application/json

{
  "name": "Imagine",
  "path": "/music/john-lennon/imagine.mp3",
  "plays": 0
}
```

**Respuesta**:

```json
{
  "success": true,
  "message": "Canción creada exitosamente",
  "data": {
    "_id": "64f8a2b5c9e8b1234567890b",
    "name": "Imagine",
    "path": "/music/john-lennon/imagine.mp3",
    "plays": 0,
    "createdAt": "2023-09-06T10:35:00.000Z",
    "updatedAt": "2023-09-06T10:35:00.000Z"
  }
}
```

#### 6. PUT /api/songs/:id - Actualizar canción completa

```http
PUT /api/songs/64f8a2b5c9e8b1234567890a
Content-Type: application/json

{
  "name": "Bohemian Rhapsody (Remastered)",
  "path": "/music/queen/bohemian-rhapsody-remastered.mp3",
  "plays": 2000
}
```

#### 7. PATCH /api/songs/:id - Actualizar canción parcialmente

```http
PATCH /api/songs/64f8a2b5c9e8b1234567890a
Content-Type: application/json

{
  "plays": 2500
}
```

#### 8. DELETE /api/songs/:id - Eliminar canción

```http
DELETE /api/songs/64f8a2b5c9e8b1234567890a
```

**Respuesta**:

```json
{
  "success": true,
  "message": "Canción eliminada exitosamente",
  "data": {
    "deletedSong": {
      "_id": "64f8a2b5c9e8b1234567890a",
      "name": "Bohemian Rhapsody",
      "path": "/music/queen/bohemian-rhapsody.mp3",
      "plays": 1500
    },
    "deletedCount": 1
  }
}
```

## Modelo de Datos

### Esquema de Canción

```javascript
{
  _id: ObjectId,        // ID único generado por MongoDB
  name: String,         // Nombre de la canción (requerido, único)
  path: String,         // Ruta o URL de la canción (requerido)
  plays: Number,        // Número de reproducciones (default: 0)
  createdAt: Date,      // Fecha de creación
  updatedAt: Date       // Fecha de última actualización
}
```

### Validaciones

- **name**: Requerido, no puede estar vacío, debe ser único
- **path**: Requerido, no puede estar vacío
- **plays**: Opcional, debe ser un número >= 0, default: 0
- **\_id**: Debe ser un ObjectId válido de MongoDB para operaciones de lectura, actualización y eliminación

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa (GET, PUT, PATCH)
- **201 Created**: Recurso creado exitosamente (POST)
- **400 Bad Request**: Datos inválidos o faltantes
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Recurso ya existe (nombre duplicado)
- **500 Internal Server Error**: Error del servidor

## Manejo de Errores

Todas las respuestas de error siguen el siguiente formato:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Pruebas con Postman

### Colección de Pruebas

1. **GET All Songs**: `GET http://localhost:3000/api/songs`
2. **GET Song by ID**: `GET http://localhost:3000/api/songs/:id`
3. **CREATE Song**: `POST http://localhost:3000/api/songs`
4. **UPDATE Song**: `PUT http://localhost:3000/api/songs/:id`
5. **PATCH Song**: `PATCH http://localhost:3000/api/songs/:id`
6. **DELETE Song**: `DELETE http://localhost:3000/api/songs/:id`
7. **Health Check**: `GET http://localhost:3000/health`

### Headers Requeridos

```
Content-Type: application/json
```

## Desarrollo Local

### Prerrequisitos

- Node.js (v14 o superior)
- npm o yarn
- Acceso a MongoDB Atlas

### Comandos de Desarrollo

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Verificar dependencias
npm list

# Auditoría de seguridad
npm audit
```

## Logs y Monitoreo

El servidor incluye logging detallado:

- Todas las peticiones HTTP con timestamp
- Operaciones de base de datos
- Errores con stack trace
- Estado de conexión a MongoDB

## Consideraciones de Seguridad

- Variables de entorno para credenciales sensibles
- Validación de entrada en todos los endpoints
- Manejo de errores sin exposición de información sensible
- Validación de ObjectId para prevenir inyecciones

## Próximas Mejoras

- Autenticación y autorización
- Paginación para listado de canciones
- Búsqueda y filtros
- Rate limiting
- Documentación con Swagger
- Tests unitarios e integración
- CI/CD pipeline
- Monitoreo y métricas
