import __dirname from './index.js';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
  definition: {
    //Sirve para especificar las reglas específicas que seguirá la openapi generada.
    openapi: '3.0.1',
    info: {
      title: 'Adopteme API',
      description:
        'API para manejar el CRUD de usuarios y mascotas, y podes asignar mascotas a usuarios'
    }
  },
  //Especificamos la ruta a los archivos que contendrán la documentación
  apis: [path.join(__dirname, '../docs/**/*.yaml')]
};

//Traduce la configuración y archivos de especificaciones en un objeto JSON que Swagger UI puede interpretar y mostrar en un navegador
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

export default swaggerSpecs;
