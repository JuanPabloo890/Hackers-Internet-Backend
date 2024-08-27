import Administrador from '../models/Administrador.js';
import { sendMailToRecoveryPassword } from '../config/nodemailer.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const validarYProcesarTelefono = (telefono, res) => {
  // Expresión regular para validar exactamente 10 dígitos
  const telefonoValido = /^\d{10}$/;

  if (!telefonoValido.test(telefono)) {
    res.status(400).json({ msg: "El número de teléfono debe contener exactamente 10 dígitos." });
    return false;
  }
  return true;
};

const loginAdmin = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    const adminBDD = await Administrador.findByCorreo(correo);

    if (!adminBDD) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    const verificarPassword = await bcrypt.compare(password, adminBDD.password);

    if (!verificarPassword) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const { nombre, telefono, id } = adminBDD;

    res.status(200).json({
      nombre,
      correo: adminBDD.correo,
      telefono,
      id
    });
  } catch (error) {
    console.error("Error en el login del administrador:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const actualizarAdmin = async (req, res) => {
  const { id } = req.params;
  const { correo, nombre, telefono, password } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ msg: "ID inválido. Debe ser un número entero." });
  }

  // Validar solo el campo de teléfono
  if (telefono && !validarYProcesarTelefono(telefono, res)) {
    return; // Teléfono inválido
  }

  try {
    // Solo actualizar campos proporcionados
    const updateData = {};
    if (correo) updateData.correo = correo;
    if (nombre) updateData.nombre = nombre;
    if (telefono) updateData.telefono = telefono;
    if (password) {
      // Hashear la nueva contraseña si se proporciona
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password_hash = hashedPassword;
    }

    // Actualizar administrador en la base de datos
    const adminActualizado = await Administrador.update(id, updateData);

    if (!adminActualizado) {
      return res.status(404).json({ msg: "Administrador no encontrado" });
    }

    res.status(200).json(adminActualizado);
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


const recuperarPassword = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  try {
    const adminBDD = await Administrador.findByCorreo(correo);

    if (!adminBDD) {
      return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const newPassword = crypto.randomBytes(8).toString('hex');

    // Enviar la nueva contraseña temporal sin hashear por correo electrónico
    await sendMailToRecoveryPassword(correo, newPassword);

    // Hashear la nueva contraseña antes de actualizarla en la base de datos
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Administrador.update(adminBDD.id, {
      correo: adminBDD.correo,
      nombre: adminBDD.nombre,
      telefono: adminBDD.telefono,
      password_hash: hashedPassword
    });

    res.status(200).json({ msg: "Revisa tu correo electrónico para obtener tu nueva contraseña temporal" });
  } catch (error) {
    console.error("Error en la recuperación de la contraseña del administrador:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export {
  loginAdmin,
  actualizarAdmin,
  recuperarPassword
};
