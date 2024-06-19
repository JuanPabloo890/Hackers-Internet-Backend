import Mantenimiento from '../models/Mantenimiento.js';

// Crear un nuevo mantenimiento
const createMantenimiento = async (req, res) => {
  try {
    const mantenimientoData = req.body;
    const nuevoMantenimiento = await Mantenimiento.create(mantenimientoData);
    res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    console.error('Error al crear mantenimiento:', error);
    res.status(500).json({ msg: 'Error al crear mantenimiento' });
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
