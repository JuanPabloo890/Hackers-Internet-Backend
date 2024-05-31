import {Router} from 'express';

const router = Router();

import{
    createMantenimiento,
    deleteMantenimiento,
    getMantenimientoById,
    getMantenimientosByEquipoId,
    updateMantenimiento

}from '../controllers/mantenimiento_controllers.js';

router.post('/mantenimiento', createMantenimiento);
router.get('/mantenimiento/:id_unico', getMantenimientoById);
router.get('/equipo/:id_unico', getMantenimientosByEquipoId);
router.put('/mantenimiento/:id_unico', updateMantenimiento);
router.delete('/mantenimiento/:id_unico', deleteMantenimiento);

export default router;