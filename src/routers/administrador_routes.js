import { Router } from 'express';
import {
  loginAdmin,
  actualizarAdmin,
  recuperarPassword,
} from '../controllers/administrador_controllers.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Administrador
 *   description: Endpoints para el manejo de administradores
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Administrador:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del administrador (generado automáticamente)
 *         correo:
 *           type: string
 *           format: email
 *           description: Correo electrónico del administrador
 *         nombre:
 *           type: string
 *           description: Nombre completo del administrador
 *         telefono:
 *           type: string
 *           description: Número de teléfono del administrador
 *         password:
 *           type: string
 *           description: Contraseña del administrador
 *       required:
 *         - correo
 *         - nombre
 *         - telefono
 *         - password
 *       example:
 *         correo: heyer.tinoco@epn.edu.ec
 *         nombre: Heyer Tinoco
 *         telefono: 0987547665
 *         password: admin123
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login de administrador
 *     description: Iniciar sesión como administrador
 *     tags: [Administrador]
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
 *               correo: heyer.tinoco@epn.edu.ec
 *               password: admin123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/admin/login', loginAdmin);

/**
 * @swagger
 * /api/admin/{id}:
 *   put:
 *     summary: Actualizar administrador
 *     description: Actualizar el perfil del administrador
 *     tags: [Administrador]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del administrador a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Administrador'
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       404:
 *         description: Administrador no encontrado
 */
router.put('/admin/:id', actualizarAdmin);

/**
 * @swagger
 * /api/admin/recuperar-password:
 *   post:
 *     summary: Recuperar contraseña
 *     description: Enviar correo para recuperar la contraseña del administrador
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *             example:
 *               correo: heyer.tinoco@epn.edu.ec
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente
 *       404:
 *         description: Administrador no encontrado
 */
router.post('/admin/recuperar-password', recuperarPassword);

export default router;
