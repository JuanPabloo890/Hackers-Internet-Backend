import Cliente from "../models/Clientes.js"; //importa el modelo Cliente
import { sendMail } from "../config/nodemailer.js"; //Importamos el nodemiler que se encarga de mandar el email al usuario
import { generateRandomPassword } from "../config/password.js"; //Importamos la generacion de contraseñas random
import bcrypt from "bcrypt"; //esta libreria nos permite cifrar las contrasenas
import pool from "../database.js";

//validacion del telefono

const validarYProcesarTelefono = (telefono, res) => {
  // Expresión regular para validar exactamente 10 dígitos
  const telefonoValido = /^\d{10}$/;

  if (!telefonoValido.test(telefono)) {
    res.status(400).json({ msg: "El número de teléfono debe contener exactamente 10 dígitos." });
    return false;
  }
  return true;
};

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

  if (!validarYProcesarTelefono(telefono, res)) {
    return; // Teléfono inválido
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

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ msg: "ID inválido. Debe ser un número entero." });
  }

  // Validar que todos los campos sean proporcionados
  if (!correo || !nombre || !telefono) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  // Validar y procesar el teléfono
  if (!validarYProcesarTelefono(telefono, res)) {
    return; // Teléfono inválido
  }

  try {
    // Obtener el cliente existente para comparar el correo
    const clienteExistente = await Cliente.findById(id);
    if (!clienteExistente) {
      return res.status(404).json({ msg: "Cliente no encontrado" });
    }

    // Preparar los datos a actualizar
    const datosActualizados = {
      nombre,
      telefono,
    };

    // Verificar si el correo ha cambiado
    if (correo !== clienteExistente.correo) {
      datosActualizados.correo = correo;
      // Generar y cifrar una nueva contraseña para el cliente
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      // Enviar un correo electrónico al nuevo correo con la nueva contraseña
      await sendMail(password, correo);
    }

    // Actualizar cliente en la base de datos
    const clienteActualizado = await Cliente.update(id, datosActualizados);

    // Responder con el cliente actualizado
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
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ msg: "ID inválido. Debe ser un número entero." });
  }

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
