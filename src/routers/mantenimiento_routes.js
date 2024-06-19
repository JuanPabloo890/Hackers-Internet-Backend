import { Router } from 'express';
import {
  createMantenimiento,
  getMantenimientoById,
  getMantenimientosByEquipoId,
  updateMantenimiento,
  deleteMantenimiento,
} from '../controllers/mantenimiento_controllers.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mantenimiento
 *   description: Endpoints para el manejo de mantenimientos de equipos
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Mantenimiento:
 *       type: object
 *       properties:
 *         id_unico:
 *           type: integer
 *           description: ID único del mantenimiento (generado automáticamente)
 *         id_equipo:
 *           type: integer
 *           description: ID del equipo asociado al mantenimiento
 *         descripcion:
 *           type: string
 *           maxLength: 255
 *           description: Descripción del mantenimiento
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del mantenimiento
 *       required:
 *         - id_equipo
 *         - descripcion
 *         - fecha
 *       example:
 *         id_equipo: 1
 *         descripcion: Mantenimiento preventivo programado
 *         fecha: '2024-06-14T10:30:00Z'
 */
/**
 * @swagger
 * /api/mantenimiento:
 *   post:
 *     summary: Crear un nuevo mantenimiento
 *     tags: [Mantenimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mantenimiento'
 *     responses:
 *       201:
 *         description: Mantenimiento creado correctamente
 *       400:
 *         description: Error al crear el mantenimiento
 */
router.post('/mantenimiento', createMantenimiento);

/**
 * @swagger
 * /api/mantenimiento/{id_unico}:
 *   get:
 *     summary: Obtener detalles de un mantenimiento por ID único
 *     tags: [Mantenimiento]
 *     parameters:
 *       - in: path
 *         name: id_unico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del mantenimiento a obtener
 *     responses:
 *       200:
 *         description: Detalles del mantenimiento obtenidos correctamente
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.get('/mantenimiento/:id_unico', getMantenimientoById);

/**
 * @swagger
 * /api/equipo/{id_unico}:
 *   get:
 *     summary: Obtener todos los mantenimientos de un equipo por ID
 *     tags: [Mantenimiento]
 *     parameters:
 *       - in: path
 *         name: id_unico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo del cual obtener los mantenimientos
 *     responses:
 *       200:
 *         description: Lista de mantenimientos del equipo obtenida correctamente
 *       404:
 *         description: Equipo no encontrado o no tiene mantenimientos asociados
 */
router.get('/mantenimiento/equipo/:id_equipo', getMantenimientosByEquipoId);

/**
 * @swagger
 * /api/mantenimiento/{id_unico}:
 *   put:
 *     summary: Actualizar un mantenimiento por ID único
 *     tags: [Mantenimiento]
 *     parameters:
 *       - in: path
 *         name: id_unico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del mantenimiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mantenimiento'
 *     responses:
 *       200:
 *         description: Mantenimiento actualizado correctamente
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.put('/mantenimiento/:id_unico', updateMantenimiento);

/**
 * @swagger
 * /api/mantenimiento/{id_unico}:
 *   delete:
 *     summary: Eliminar un mantenimiento por ID único
 *     tags: [Mantenimiento]
 *     parameters:
 *       - in: path
 *         name: id_unico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del mantenimiento a eliminar
 *     responses:
 *       200:
 *         description: Mantenimiento eliminado correctamente
 *       404:
 *         description: Mantenimiento no encontrado
 */
router.delete('/mantenimiento/:id_unico', deleteMantenimiento);

export default router;
