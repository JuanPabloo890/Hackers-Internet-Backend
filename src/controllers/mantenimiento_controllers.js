import Mantenimiento from '../models/Mantenimiento.js';

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
    if (!id_equipo){
      return res.status(400).json({ error: 'El ID del equipo es requerido' });
    }
    const mantenimientos = await Mantenimiento.findByEquipoId(id_equipo);
    
    // Verificar si mantenimientos es null o si la longitud es 0
    if (!mantenimientos || mantenimientos.length === 0) {
      return res.status(404).json({ msg: 'Equipo no encontrado o no tiene mantenimientos asociados' });
    }

    res.status(200).json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener mantenimientos por ID de equipo:', error);
    res.status(500).json({ msg: 'Error al obtener mantenimientos' });
  }
};

const getAllMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.findAll();
    if (!mantenimientos || mantenimientos.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron mantenimientos' });
    }
    res.status(200).json(mantenimientos);
  } catch (error) {
    console.error('Error al obtener todos los mantenimientos:', error);
    res.status(500).json({ msg: 'Error al obtener todos los mantenimientos' });
  }
};

export {
  getMantenimientoById,
  getMantenimientosByEquipoId,
  getAllMantenimientos
};
