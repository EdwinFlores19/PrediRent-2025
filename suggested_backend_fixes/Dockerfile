# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para build si fuera necesario)
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Si hubiera un paso de build (ej. TypeScript o frontend), iría aquí
# RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Instalar PM2 globalmente para gestión de procesos
RUN npm install -g pm2

# Copiar dependencias de producción solamente
COPY package*.json ./
RUN npm ci --only=production

# Copiar el código de la aplicación desde el builder
COPY --from=builder /app .

# Exponer el puerto (ajustar según la app, ej. 3000)
EXPOSE 3000

# Usuario no root por seguridad
USER node

# Comando de inicio usando PM2
CMD ["pm2-runtime", "server.js"]
