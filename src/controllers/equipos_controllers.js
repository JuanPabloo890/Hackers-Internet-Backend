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

const listarEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll();
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al listar los equipos:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Consultar equipos por estado
const equiposPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const equipos = await Equipo.findByEstado(estado);
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos por estado:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Consultar equipos por marca
const equiposPorMarca = async (req, res) => {
  try {
    const { marca } = req.params;
    const equipos = await Equipo.findByMarca(marca);
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos por marca:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Consultar equipos por modelo
const equiposPorModelo = async (req, res) => {
  try {
    const { modelo } = req.params;
    const equipos = await Equipo.findByModelo(modelo);
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos por modelo:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Consultar equipos por ID del cliente
const equiposPorIdCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const equipos = await Equipo.findByIdCliente(id_cliente);
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error al obtener equipos por ID del cliente:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export {
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  detalleEquipo,
  listarEquipos,
  equiposPorEstado,
  equiposPorMarca,
  equiposPorModelo,
  equiposPorIdCliente,
};

