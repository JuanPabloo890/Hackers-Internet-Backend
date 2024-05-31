import {Router} from 'express'

const router = Router();

import{
    loginCliente,
    detalleCliente,
    registrarCliente,
    actualizarCliente,
    eliminarCliente

}from "../controllers/cliente_controllers.js"

router.post('/cliente/login', loginCliente); //Ruta para logearse como cliente
router.post('/cliente', registrarCliente); // Ruta para registrar un nuevo cliente
router.put('/cliente/:id', actualizarCliente); // Ruta para actualizar un cliente existente
router.get('/cliente/:id', detalleCliente); // Ruta para obtener los detalles de un cliente
router.delete('/cliente/:id', eliminarCliente); // Ruta para eliminar un cliente

//Exportar la variable router
export default router