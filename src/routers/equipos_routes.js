import { Router } from 'express';

const router = Router();

import {
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  detalleEquipo,
  listarEquipos
} from '../controllers/equipos_controllers.js';

/**
 * @swagger
 * tags:
 *   name: Equipos
 *   description: Endpoints para el manejo de equipos
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Equipo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del equipo (generado automáticamente)
 *         marca:
 *           type: string
 *           description: Marca del equipo
 *         modelo:
 *           type: string
 *           description: Modelo del equipo
 *         estado:
 *           type: string
 *           description: Estado del equipo
 *         id_cliente:
 *           type: integer
 *           description: ID del cliente dueño del equipo
 *         observaciones:
 *           type: string
 *           description: Observaciones sobre el equipo (opcional)
 *       example:
 *         marca: Lenovo
 *         modelo: ThinkPad
 *         estado: Nuevo
 *         id_cliente: 1
 *         observaciones: Sin observaciones
 */


/**
 * @swagger
 * /api/equipo:
 *   post:
 *     summary: Registrar un nuevo equipo
 *     tags: [Equipos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       201:
 *         description: Equipo registrado correctamente
 *       400:
 *         description: Error al registrar el equipo
 */
router.post('/equipo', registrarEquipo);

/**
 * @swagger
 * /api/equipo/{id}:
 *   put:
 *     summary: Actualizar un equipo existente
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipo'
 *     responses:
 *       200:
 *         description: Equipo actualizado correctamente
 *       404:
 *         description: Equipo no encontrado
 */
router.put('/equipo/:id', actualizarEquipo);

/**
 * @swagger
 * /api/equipo/{id}:
 *   delete:
 *     summary: Eliminar un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo a eliminar
 *     responses:
 *       200:
 *         description: Equipo eliminado correctamente
 *       404:
 *         description: Equipo no encontrado
 */
router.delete('/equipo/:id', eliminarEquipo);

/**
 * @swagger
 * /api/equipo/{id}:
 *   get:
 *     summary: Obtener los detalles de un equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del equipo a obtener detalles
 *     responses:
 *       200:
 *         description: Detalles del equipo obtenidos correctamente
 *       404:
 *         description: Equipo no encontrado
 */
router.get('/equipo/:id', detalleEquipo);

/**
 * @swagger
 * /api/equipos:
 *   get:
 *     summary: Obtener todos los equipos
 *     tags: [Equipos]
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida correctamente
 *       404:
 *         description: No se encontraron equipos
 */
router.get('/equipos', listarEquipos);

export default router;
