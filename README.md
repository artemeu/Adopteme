# Proyecto Backend Adoptenme

Este proyecto es una aplicación backend creada con **Node.js** que utiliza **Docker** para su
ejecución.

### Descripción

La aplicación se conecta a una base de datos MongoDB y expone una API REST para manejar la
información. La aplicación utiliza variables de entorno definidas en un archivo `.env` para
configurar la conexión a MongoDB y otras configuraciones sensibles.

### Requisitos

1. **Docker**: Asegúrate de tener Docker instalado en tu máquina. Si no lo tienes, puedes
   descargarlo desde [Docker](https://www.docker.com/get-started).
2. **Archivo `.env`**: Este proyecto depende de variables de entorno, por lo que necesitas crear tu
   propio archivo `.env` con las siguientes variables:
   - `PORT`
   - `MONGODB_URI`
   - `USE_DB`
   - `SECRET`
   - `NODE_ENV`

### Pasos para ejecutar la aplicación

1. **Clona el repositorio**: Clona este repositorio en tu máquina local:
   ```bash
   git clone https://github.com/artemeu/Adopteme.git
   ```
2. **Crear tu un archivo .env**: Crea un archivo .env en la raíz del proyecto con las variables
   necesarias.

3. **Ejecutar la imagen Docker**: Si prefieres ejecutar la imagen directamente desde Docker Hub, usa
   el siguiente comando:
   ```bash
   docker run -p 8080:8080 -v ${PWD}/.env:/app/.env artemeu/backend-adoptenme
   ```

### Imagen Docker en Docker Hub

La imagen en Docker de mi proyecto está disponible en Docker Hub. Puedes obtenerla con el siguiente
enlace: https://hub.docker.com/r/artemeu/backend-adoptenme
