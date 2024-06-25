import { Router } from 'express';

import {
  createMantenimiento,
  getMantenimientoById,
  getMantenimientosByEquipoId,
  updateMantenimiento,
  deleteMantenimiento,
  getAllMantenimientos
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
 *         estado_actual:
 *           type: string
 *           maxLength: 50
 *           description: Estado actual del equipo
 *       required:
 *         - id_equipo
 *         - descripcion
 *         - fecha
 *         - estado_actual
 *       example:
 *         id_equipo: 1
 *         descripcion: Mantenimiento preventivo programado
 *         fecha: '2024-06-14'
 *         estado_actual: 'Operativo'
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
 * /api/mantenimiento/equipo/{id_equipo}:
 *   get:
 *     summary: Obtener todos los mantenimientos de un equipo por ID
 *     tags: [Mantenimiento]
 *     parameters:
 *       - in: path
 *         name: id_equipo
 *         required: true
 *         schema:
 *           type: string
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
 * /api/mantenimiento:
 *   get:
 *     summary: Obtener todos los mantenimientos registrados
 *     tags: [Mantenimiento]
 *     responses:
 *       200:
 *         description: Lista de mantenimientos obtenida correctamente
 *       500:
 *         description: Error al obtener mantenimientos
 */
router.get('/mantenimiento', getAllMantenimientos);

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
