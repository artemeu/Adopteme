FROM node:18.20.0-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
