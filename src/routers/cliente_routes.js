import { Router } from 'express';

const router = Router();

import {
  loginCliente,
  detalleCliente,
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
  listarClientes
} from '../controllers/cliente_controllers.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         correo:
 *           type: string
 *         nombre:
 *           type: string
 *         telefono:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         id: 1
 *         correo: juan@example.com
 *         nombre: Juan Pérez
 *         telefono: "0987654321"
 *         password: password123
 */

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Endpoints para el manejo de clientes
 */

/**
 * @swagger
 * /api/cliente/login:
 *   post:
 *     summary: Iniciar sesión como cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               correo: juan@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Cliente autenticado correctamente
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/cliente/login', loginCliente);

/**
 * @swagger
 * /api/cliente:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             correo: juan@example.com
 *             nombre: Juan Pérez
 *             telefono: "0987654321"
 *     responses:
 *       201:
 *         description: Cliente registrado correctamente
 *       400:
 *         description: Error al registrar el cliente
 */
router.post('/cliente', registrarCliente);

/**
 * @swagger
 * /api/cliente/{id}:
 *   put:
 *     summary: Actualizar un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             correo: juan_updated@example.com
 *             nombre: Juan Pérez Updated
 *             telefono: 0987654322
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/cliente/:id', actualizarCliente);

/**
 * @swagger
 * /api/cliente/{id}:
 *   get:
 *     summary: Obtener los detalles de un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a obtener detalles
 *     responses:
 *       200:
 *         description: Detalles del cliente obtenidos correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/cliente/:id', detalleCliente);

/**
 * @swagger
 * /api/cliente/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente a eliminar
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/cliente/:id', eliminarCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente
 *       404:
 *         description: No se encontraron clientes
 */
router.get('/clientes', listarClientes);

export default router;
