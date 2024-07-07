import Cliente from "../models/Clientes.js"; //importa el modelo Cliente
import { sendMail } from "../config/nodemailer.js"; //Importamos el nodemiler que se encarga de mandar el email al usuario
import { generateRandomPassword } from "../config/password.js"; //Importamos la generacion de contraseñas random
import bcrypt from "bcrypt"; //esta libreria nos permite cifrar las contrasenas
import pool from "../database.js";

const loginCliente = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    const clienteBDD = await Cliente.findByCorreo(correo);

    if (!clienteBDD) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const verificarPassword = await bcrypt.compare(password, clienteBDD.password);

    if (!verificarPassword) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const { nombre, telefono, id } = clienteBDD;

    res.status(200).json({
      nombre,
      correo: clienteBDD.correo,
      telefono,
      id
    });
  } catch (error) {
    console.error("Error en el login del cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const registrarCliente = async (req, res) => {
  const { correo, nombre, telefono } = req.body;

  if (!correo || !nombre || !telefono) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el correo ya está registrado
    const clienteExistente = await Cliente.findByCorreo(correo);
    if (clienteExistente) {
      return res.status(400).json({ msg: "El correo electrónico ya se encuentra registrado" });
    }

    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    await sendMail(password, correo);

    const nuevoCliente = await Cliente.create({
      correo,
      nombre,
      telefono,
      password: hashedPassword,
    });

    // Responder con un mensaje en lugar del objeto creado
    // PARA LA PREUBA DE CARGA SE NECESITA EL ID: id: nuevoCliente.id, 
    res.status(200).json({msg: "Registro exitoso del cliente y correo con la contraseña enviado correctamente." });
  } catch (error) {
    console.error("Error al registrar el cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { correo, nombre, telefono } = req.body;

  if (!correo || !nombre || !telefono) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    const clienteExistente = await Cliente.findById(id);
    if (!clienteExistente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    const clienteActualizado = await Cliente.update(id, {
      correo,
      nombre,
      telefono,
    });

    res.status(200).json(clienteActualizado);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero, eliminar los equipos asociados al cliente
    await pool.query("DELETE FROM Equipos WHERE id_Cliente = $1", [id]);

    // Luego, eliminar el cliente
    const result = await pool.query(
      "DELETE FROM Clientes WHERE id = $1 RETURNING *",
      [id]
    );

    const clienteEliminado = result.rows[0];

    if (!clienteEliminado) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    res.status(200).json({ msg: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const detalleCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findById(id);

    if (!cliente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error("Error al obtener los detalles del cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al listar los equipos:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//exportar las funciones
export {
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
  detalleCliente,
  loginCliente,
  listarClientes,
};
