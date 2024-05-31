import Equipo from '../models/Equipos.js';

//Registrar un equipo nuevo
const registrarEquipo = async (req, res) => {
  try {
    const equipoData = req.body;
    console.log("Id del cliente: ", equipoData.id_cliente);
    const nuevoEquipo = await Equipo.create(equipoData);
    res.status(201).json(nuevoEquipo);
  } catch (error) {
    console.error("Error al registrar el equipo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Actualizar equipo
const actualizarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipoData = req.body;
    const equipoActualizado = await Equipo.update(id, equipoData);
    if (!equipoActualizado) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }
    res.status(200).json(equipoActualizado);
  } catch (error) {
    console.error("Error al actualizar el equipo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Eliminar un equipo
const eliminarEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipoEliminado = await Equipo.delete(id);
    if (!equipoEliminado) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }
    res.status(200).json({ msg: "Equipo eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el equipo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

//Ver el detalle de un equipo
const detalleEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findById(id);
    if (!equipo) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }
    res.status(200).json(equipo);
  } catch (error) {
    console.error("Error al obtener los detalles del equipo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export {
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  detalleEquipo
};
