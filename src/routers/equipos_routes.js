import { Router } from 'express';

import { notificarCliente } from '../config/nodemailer.js';

const router = Router();

import {
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  detalleEquipo,
  listarEquipos,
  equiposPorEstado,
  equiposPorModelo,
  equiposPorMarca,
  equiposPorIdCliente
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
 *           type: string
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
 *         tipo:
 *           type: string
 *           description: Tipo del equipo (por ejemplo, impresora, laptop)
 *       example:
 *         marca: Lenovo
 *         modelo: ThinkPad
 *         estado: Nuevo
 *         id_cliente: 1
 *         observaciones: Sin observaciones
 *         tipo: laptop
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
 *           type: string
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
 *           type: string
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
 *           type: string
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

/**
 * @swagger
 * /api/equipos/estado/{estado}:
 *   get:
 *     summary: Consultar equipos por estado
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *         description: Estado de los equipos a consultar
 *     responses:
 *       200:
 *         description: Equipos obtenidos correctamente
 *       404:
 *         description: No se encontraron equipos con ese estado
 */
router.get('/equipos/estado/:estado', equiposPorEstado);

/**
 * @swagger
 * /api/equipos/modelo/{modelo}:
 *   get:
 *     summary: Consultar equipos por modelo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: modelo
 *         required: true
 *         schema:
 *           type: string
 *         description: Modelo de los equipos a consultar
 *     responses:
 *       200:
 *         description: Equipos obtenidos correctamente
 *       404:
 *         description: No se encontraron equipos con ese modelo
 */
router.get('/equipos/modelo/:modelo', equiposPorModelo);

/**
 * @swagger
 * /api/equipos/marca/{marca}:
 *   get:
 *     summary: Consultar equipos por marca
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: marca
 *         required: true
 *         schema:
 *           type: string
 *         description: Marca de los equipos a consultar
 *     responses:
 *       200:
 *         description: Equipos obtenidos correctamente
 *       404:
 *         description: No se encontraron equipos con esa marca
 */
router.get('/equipos/marca/:marca', equiposPorMarca);

/**
 * @swagger
 * /api/equipos/cliente/{id_cliente}:
 *   get:
 *     summary: Consultar equipos por ID del cliente
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id_cliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente cuyos equipos se quieren consultar
 *     responses:
 *       200:
 *         description: Equipos obtenidos correctamente
 *       404:
 *         description: No se encontraron equipos para ese cliente
 */
router.get('/equipos/cliente/:id_cliente', equiposPorIdCliente);

/**
 * @swagger
 * /api/equipos/{id_equipo}/notificar:
 *   post:
 *     summary: Notificar al cliente sobre el estado de su equipo
 *     tags: [Equipos]
 *     parameters:
 *       - in: path
 *         name: id_equipo
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del equipo a notificar
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       404:
 *         description: Equipo o cliente no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.post('/equipos/:id_equipo/notificar', notificarCliente);

export default router;
