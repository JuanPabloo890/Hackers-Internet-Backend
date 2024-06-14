import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'Documentación de la API de TESIS',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://tesis-kphi.onrender.com',
        description: 'Servidor en Render',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routers/administrador_routes.js'),
    path.resolve(__dirname, '../routers/cliente_routes.js'),
    path.resolve(__dirname, '../routers/equipos_routes.js'),
    path.resolve(__dirname, '../routers/mantenimiento_routes.js')
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
