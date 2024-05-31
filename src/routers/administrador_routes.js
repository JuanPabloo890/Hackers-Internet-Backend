import {Router} from 'express'

const router = Router();

import{
    loginAdmin,
    actualizarAdmin,
    recuperarPassword

} from "../controllers/administrador_controllers.js"

router.post('/admin/login', loginAdmin); //Ruta para logearse como cliente
router.put('/admin/:id', actualizarAdmin); //Ruta para actualizar el perfil del administrador
router.post('/admin/recuperar-password', recuperarPassword) //Ruta para recuperar el password el administrador

//Exportar la variable router
export default router