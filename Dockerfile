# Usar la imagen oficial de Node.js basada en Alpine Linux
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de npm
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Crear un usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar la propiedad de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
