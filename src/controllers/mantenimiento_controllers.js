import Mantenimiento from '../models/Mantenimiento.js';
import { sendMailToCliente } from '../config/nodemailer.js';
import Equipo from '../models/Equipos.js'
import Cliente from '../models/Clientes.js'

// Crear un nuevo mantenimiento
const createMantenimiento = async (req, res) => {
  try {
    const { id_equipo, descripcion, fecha, estado_actual } = req.body;
    const mantenimiento = await Mantenimiento.create({ id_equipo, descripcion, fecha, estado_actual });

    // Ejemplo hipotético: Obtener cliente asociado al equipo para enviar correo
    const equipo = await Equipo.findById(id_equipo);
    const cliente = await Cliente.findById(equipo.id_cliente);
    const clienteEmail = cliente.email;

    // Enviar correo al cliente
    await sendMailToCliente(clienteEmail, estado_actual, descripcion, `${equipo.marca} ${equipo.modelo}`);

    res.status(201).json({ message: 'Mantenimiento registrado correctamente', mantenimiento });
  } catch (error) {
    console.error('Error al crear el mantenimiento:', error);
    res.status(400).json({ error: 'Error al crear el mantenimiento' });
  }
};

// Obtener un mantenimiento por su ID
const getMantenimientoById = async (req, res) => {
  try {
    const { id_unico } = req.params;
    const mantenimiento = await Mantenimiento.findById(id_unico);
    if (!mantenimiento) {
      return res.status(404).json({ msg: 'Mantenimiento no encontrado' });
    }
    res.status(200).json(mantenimiento);
  } catch (error) {
    console.error('Error al obtener mantenimiento por ID:', error);
    res.status(500).json({ msg: 'Error al obtener mantenimiento' });
  }
};

// Obtener todos los mantenimientos por ID de equipo
const getMantenimientosByEquipoId = async (req, res) => {
  try {
    const { id_equipo } = req.params;
    const mantenimientos = await Mantenimiento.findByEquipoId(id_equipo);
    if (mantenimientos.length === 0) {
      return res.status(404).json({ msg: 'Equipo no encontrado o no tiene mantenimientos asociados' });
    }
    res.status(200).json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos por ID de equipo:', error);
    res.status(500).json({ msg: 'Error al obtener mantenimientos' });
  }
};


// Actualizar un mantenimiento
const updateMantenimiento = async (req, res) => {
  try {
    const { id_unico } = req.params;
    const mantenimientoData = req.body;
    const mantenimientoActualizado = await Mantenimiento.update(id_unico, mantenimientoData);
    if (!mantenimientoActualizado) {
      return res.status(404).json({ msg: 'Mantenimiento no encontrado' });
    }
    res.status(200).json(mantenimientoActualizado);
  } catch (error) {
    console.error('Error al actualizar mantenimiento:', error);
    res.status(500).json({ msg: 'Error al actualizar mantenimiento' });
  }
};

// Eliminar un mantenimiento
const deleteMantenimiento = async (req, res) => {
  try {
    const { id_unico } = req.params;
    const mantenimientoEliminado = await Mantenimiento.delete(id_unico);
    if (!mantenimientoEliminado) {
      return res.status(404).json({ msg: 'Mantenimiento no encontrado' });
    }
    res.status(200).json(mantenimientoEliminado);
  } catch (error) {
    console.error('Error al eliminar mantenimiento:', error);
    res.status(500).json({ msg: 'Error al eliminar mantenimiento' });
  }
};

export {
  createMantenimiento,
  getMantenimientoById,
  getMantenimientosByEquipoId,
  updateMantenimiento,
  deleteMantenimiento
};
