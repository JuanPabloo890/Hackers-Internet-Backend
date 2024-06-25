import pool from "../database.js";
import Mantenimiento from "../models/Mantenimiento.js";
import { generateUniqueId } from "../config/password.js";

class Equipo {
  constructor({
    id,
    marca,
    modelo,
    estado,
    id_cliente,
    nombre_cliente,
    observaciones,
  }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.estado = estado;
    this.id_cliente = id_cliente;
    this.nombre_cliente = nombre_cliente;
    this.observaciones = observaciones;
  }

  static async create(equipoData) {
    const { marca, modelo, estado, id_cliente, observaciones, tipo } =equipoData;

    if (!tipo) {
      throw new Error('El campo "tipo" es requerido.');
    }

    let prefix;
    switch (tipo.toLowerCase()) {
      case "impresora":
        prefix = "IMP";
        break;
      case "laptop":
        prefix = "LAP";
        break;
      // Añadir más tipos según sea necesario
      default:
        prefix = "EQU";
    }

    const id = generateUniqueId(prefix);

    const query = `
      INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const values = [id, marca, modelo, estado, id_cliente, observaciones];
    const { rows } = await pool.query(query, values);
    const nuevoEquipo = new Equipo(rows[0]);

    // Registrar mantenimiento inicial
    await Mantenimiento.create({
      id_equipo: nuevoEquipo.id,
      descripcion: observaciones,
      fecha: new Date(),
      estado_actual: estado,
    });

    return nuevoEquipo;
  }

  static async findById(id) {
    const query = `
      SELECT Equipos.*, Clientes.nombre AS nombre_cliente
      FROM Equipos
      JOIN Clientes ON Equipos.id_cliente = Clientes.id
      WHERE Equipos.id = $1`;
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return new Equipo(rows[0]);
    }
    return null;
  }

  static async update(id, equipoData) {
    const { marca, modelo, estado, id_cliente, observaciones } = equipoData;
    const query = `
      UPDATE Equipos
      SET marca = $1, modelo = $2, estado = $3, id_cliente = $4, observaciones = $5
      WHERE id = $6
      RETURNING *`;
    const values = [marca, modelo, estado, id_cliente, observaciones, id];
    const { rows } = await pool.query(query, values);
    const equipoActualizado = new Equipo(rows[0]);

    // Registrar actualización de mantenimiento
    await Mantenimiento.create({
      id_equipo: equipoActualizado.id,
      descripcion: observaciones,
      fecha: new Date(),
      estado_actual: estado,
    });

    return equipoActualizado;
  }

  static async delete(id) {
    const query = "DELETE FROM Equipos WHERE id = $1 RETURNING *";
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? new Equipo(rows[0]) : null;
  }

  static async findAll() {
    const query = `
      SELECT Equipos.*, Clientes.nombre AS nombre_cliente
      FROM Equipos
      JOIN Clientes ON Equipos.id_cliente = Clientes.id`;
    const { rows } = await pool.query(query);
    return rows.map((row) => new Equipo(row));
  }

  static async findByEstado(estado) {
    const query = "SELECT * FROM Equipos WHERE LOWER(estado) = LOWER($1)";
    const { rows } = await pool.query(query, [estado]);
    return rows.map((row) => new Equipo(row));
  }

  static async findById(id) {
    const query = "SELECT * FROM Equipos WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return new Equipo(rows[0]);
    }
    return null;
  }

  static async findByMarca(marca) {
    const query = "SELECT * FROM Equipos WHERE LOWER(marca) = LOWER($1)";
    const { rows } = await pool.query(query, [marca]);
    return rows.map((row) => new Equipo(row));
  }

  static async findByModelo(modelo) {
    const query = "SELECT * FROM Equipos WHERE LOWER(modelo) = LOWER($1)";
    const { rows } = await pool.query(query, [modelo]);
    return rows.map((row) => new Equipo(row));
  }

  static async findByIdCliente(id_cliente) {
    const query = "SELECT * FROM Equipos WHERE id_Cliente = $1";
    const { rows } = await pool.query(query, [id_cliente]);
    return rows.map((row) => new Equipo(row));
  }
}

export default Equipo;
