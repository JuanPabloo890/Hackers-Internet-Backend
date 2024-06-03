import { Router } from 'express';

const router = Router();

import {
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  detalleEquipo,
  listarEquipos
} from '../controllers/equipos_controllers.js';

router.post('/equipo', registrarEquipo); //Ruta para registrar un nuevo equipo
router.put('/equipo/:id', actualizarEquipo); //Ruta para actualizar un equipo ya registrado a partir del Id_equipo
router.delete('/equipo/:id', eliminarEquipo); //Ruta para eliminar un equipo ya registrado a partir del Id_equipo
router.get('/equipo/:id', detalleEquipo); //Ruta para ver el detalle de un equipo por medio del Id_equipo
router.get('/equipos', listarEquipos) //Ruta para listar todos lo equipos

export default router;
