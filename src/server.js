import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routerClientes from './routers/cliente_routes.js';
import routerEquipos from './routers/equipos_routes.js';
import routerAdministrador from './routers/administrador_routes.js';
import routerMantenimiento from './routers/mantenimiento_routes.js';

dotenv.config();

// Crear una instancia de express
const app = express();

// Configuraciones 
app.set('port', process.env.PORT || 3000);
app.use(cors());

// Middlewares 
app.use(express.json());

// RUTAS
app.use('/api', routerClientes);
app.use('/api', routerEquipos); 
app.use('/api', routerAdministrador);
app.use('/api', routerMantenimiento);

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));

// Exportar la instancia de express por medio de app
export default app;
