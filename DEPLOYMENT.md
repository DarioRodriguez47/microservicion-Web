# Guía de Despliegue - Microservicio CRUD Canciones

## Opciones de Despliegue Disponibles

### ✅ Opción 1: Render.com (IMPLEMENTADA)

Esta es la opción que hemos implementado y está funcionando.

#### 1.1 Configuración en Render.com

1. **Conectar repositorio GitHub**: `DarioRodriguez47/microservicion-Web`
2. **Configurar Build Settings**:
   - **Language**: Node
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### 1.2 Variables de entorno requeridas

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=3000
```

#### 1.3 URL de despliegue

```
https://microservicion-web.onrender.com
```

### 🔄 Opción 2: Heroku (Alternativa)

#### 2.1 Preparación

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login a Heroku
heroku login

# Crear aplicación
heroku create tu-app-canciones
```

#### 2.2 Configuración de variables de entorno

```bash
heroku config:set MONGODB_URI="mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set NODE_ENV=production
```

#### 2.3 Despliegue

```bash
# Desplegar
git push heroku main

# Ver logs
heroku logs --tail
```

### 🚀 Opción 3: Railway (Alternativa)

#### 3.1 Configuración

1. Conectar repositorio en railway.app
2. Configurar variables de entorno
3. Despliegue automático desde GitHub

#### 3.2 Variables de entorno

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
```

### 🔧 Opción 4: Vercel (Para APIs)

#### 4.1 Configuración

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Desplegar
vercel
```

#### 4.2 Archivo vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

## 🧪 Testing en Producción

### Endpoints disponibles

```
GET  https://tu-dominio.com/api/health
GET  https://tu-dominio.com/api/songs
POST https://tu-dominio.com/api/songs
PUT  https://tu-dominio.com/api/songs/:id
PATCH https://tu-dominio.com/api/songs/:id
DELETE https://tu-dominio.com/api/songs/:id
```

### Prueba con cURL

```bash
# Health check
curl https://microservicion-web.onrender.com/api/health

# Obtener canciones
curl https://microservicion-web.onrender.com/api/songs

# Crear canción
curl -X POST https://microservicion-web.onrender.com/api/songs \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Song","path":"/test/song.mp3","plays":0}'
```

## 📊 Monitoreo y Logs

### Render.com

- Logs disponibles en dashboard
- Métricas de performance automáticas
- Health checks automáticos

### Heroku

```bash
heroku logs --tail
heroku ps:scale web=1
```

### General

- MongoDB Atlas: Métricas en dashboard
- Postman: Pruebas automatizadas
- Scripts de testing incluidos

---

**Estado actual**: ✅ Desplegado exitosamente en Render.com  
**URL**: https://microservicion-web.onrender.com  
**Última actualización**: 23 de Julio de 2025

#### 2.1 Preparación

```bash
# Instalar Heroku CLI
# Crear cuenta en Heroku

# Login a Heroku
heroku login

# Crear aplicación
heroku create tu-app-canciones
```

#### 2.2 Configuración de variables de entorno

```bash
# Configurar variables de entorno en Heroku
heroku config:set MONGODB_URI="mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set NODE_ENV=production
```

#### 2.3 Despliegue

```bash
# Inicializar Git (si no existe)
git init
git add .
git commit -m "Initial commit"

# Conectar con Heroku
heroku git:remote -a tu-app-canciones

# Desplegar
git push heroku main
```

### Opción 3: Despliegue en Railway

#### 3.1 Preparación

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login a Railway
railway login
```

#### 3.2 Despliegue

```bash
# Inicializar proyecto
railway init

# Configurar variables de entorno
railway variables set MONGODB_URI="mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0"
railway variables set NODE_ENV=production

# Desplegar
railway up
```

### Opción 4: Despliegue en Render

#### 4.1 Configuración en Render.com

1. Crear cuenta en Render.com
2. Conectar repositorio de GitHub
3. Configurar las siguientes variables de entorno:
   - `MONGODB_URI`: mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0
   - `NODE_ENV`: production

#### 4.2 Configuración de Build

- Build Command: `npm install`
- Start Command: `npm start`

### Opción 5: Despliegue en DigitalOcean App Platform

#### 5.1 Configuración

1. Crear cuenta en DigitalOcean
2. Ir a App Platform
3. Conectar repositorio de GitHub
4. Configurar variables de entorno
5. Desplegar

### Opción 6: Despliegue en AWS EC2

#### 6.1 Configuración de EC2

```bash
# Conectar a la instancia EC2
ssh -i tu-key.pem ec2-user@tu-instancia.amazonaws.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 para gestión de procesos
sudo npm install -g pm2

# Clonar el repositorio
git clone tu-repositorio.git
cd microservicio-canciones

# Instalar dependencias
npm install

# Configurar variables de entorno
nano .env
```

#### 6.2 Configuración con PM2

```bash
# Crear archivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'microservicio-canciones',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      MONGODB_URI: 'mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db?retryWrites=true&w=majority&appName=Cluster0'
    }
  }]
};
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save
```

## Configuración de Proxy Reverso (Nginx)

### Instalación y configuración de Nginx

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Crear configuración del sitio
sudo nano /etc/nginx/sites-available/microservicio-canciones
```

### Configuración de Nginx

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activar el sitio

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/microservicio-canciones /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

## SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoreo y Logs

### Configuración de logs con PM2

```bash
# Ver logs en tiempo real
pm2 logs microservicio-canciones

# Ver logs específicos
pm2 logs microservicio-canciones --lines 100

# Rotar logs
pm2 install pm2-logrotate
```

### Health Checks

```bash
# Script de health check
cat > health_check.sh << 'EOF'
#!/bin/bash
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ $RESPONSE -eq 200 ]; then
    echo "Service is healthy"
    exit 0
else
    echo "Service is unhealthy"
    exit 1
fi
EOF

chmod +x health_check.sh

# Programar health check cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * /path/to/health_check.sh") | crontab -
```

## Consideraciones de Seguridad

1. **Variables de entorno**: Nunca hardcodear credenciales
2. **HTTPS**: Siempre usar SSL en producción
3. **Firewall**: Configurar iptables o ufw
4. **Updates**: Mantener el sistema actualizado
5. **Logs**: Monitorear logs de acceso y errores
6. **Rate limiting**: Implementar limitación de velocidad
7. **CORS**: Configurar CORS apropiadamente

## Backup de Base de Datos

```bash
# Backup de MongoDB Atlas
mongodump --uri="mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db" --out=backup/

# Restaurar backup
mongorestore --uri="mongodb+srv://admin:admin123@cluster0.vw5pr.mongodb.net/canciones_db" backup/canciones_db/
```
