import pool from '../database.js';
import { format } from 'date-fns';

class Mantenimiento {
  constructor({ id_unico, id_equipo, descripcion, fecha, estado_actual, marca, modelo, nombre_cliente, telefono }) {
    this.id_unico = id_unico;
    this.id_equipo = id_equipo;
    this.descripcion = descripcion;
    this.fecha = format(new Date(fecha), 'yyyy-MM-dd');
    this.estado_actual = estado_actual;
    this.marca = marca;
    this.modelo = modelo;
    this.nombre_cliente = nombre_cliente;
    this.telefono = telefono;
  }

  static async create(mantenimientoData) {
    const { id_equipo, descripcion, fecha, estado_actual } = mantenimientoData;
    const formattedFecha = format(new Date(fecha), 'yyyy-MM-dd'); // Formatear fecha
    const query = `
      INSERT INTO Mantenimiento (id_equipo, descripcion, fecha, estado_actual)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [id_equipo, descripcion, formattedFecha, estado_actual]; // Usar fecha formateada
    const { rows } = await pool.query(query, values);
    return new Mantenimiento(rows[0]);
  }

  static async findById(id_unico) {
    const query = 'SELECT * FROM Mantenimiento WHERE id_unico = $1';
    const { rows } = await pool.query(query, [id_unico]);
    if (rows.length > 0) {
      return new Mantenimiento(rows[0]);
    }
    return null;
  }

  static async findByEquipoId(id_equipo) {
    const query = `
      SELECT m.descripcion, m.fecha, m.estado_actual, e.marca, e.modelo, c.nombre AS nombre_cliente, c.telefono
      FROM Mantenimiento m
      JOIN Equipos e ON m.id_equipo = e.id
      JOIN Clientes c ON e.id_cliente = c.id
      WHERE m.id_equipo = $1`;
    const { rows } = await pool.query(query, [id_equipo]);
  
    if (rows.length === 0) {
      return null;
    }
  
    const { marca, modelo, nombre_cliente, telefono } = rows[0];
    const mantenimientos = rows.map(row => ({
      estado_actual: row.estado_actual,
      descripcion: row.descripcion,
      fecha: format(new Date(row.fecha), 'yyyy-MM-dd')
    }));

    // Ordenar mantenimientos por fecha (descendente)
    mantenimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
    return {
      id_equipo,
      marca,
      modelo,
      nombre_cliente,
      telefono,
      mantenimientos
    };
  }

  static async findAll() {
    const query = `
      SELECT m.*, e.marca, e.modelo, c.nombre AS nombre_cliente, c.telefono
      FROM Mantenimiento m
      JOIN Equipos e ON m.id_equipo = e.id
      JOIN Clientes c ON e.id_cliente = c.id`;
    const { rows } = await pool.query(query);
    return rows.map(row => new Mantenimiento(row));
  }
  
  static async update(id_unico, mantenimientoData) {
    const { id_equipo, descripcion, fecha, estado_actual } = mantenimientoData;
    const formattedFecha = format(new Date(fecha), 'yyyy-MM-dd'); // Formatear fecha
    const query = `
      UPDATE Mantenimiento
      SET id_equipo = $1, descripcion = $2, fecha = $3, estado_actual = $4
      WHERE id_unico = $5
      RETURNING *`;
    const values = [id_equipo, descripcion, formattedFecha, estado_actual, id_unico]; // Usar fecha formateada
    const { rows } = await pool.query(query, values);
    return new Mantenimiento(rows[0]);
  }

  static async delete(id_unico) {
    const query = 'DELETE FROM Mantenimiento WHERE id_unico = $1 RETURNING *';
    const { rows } = await pool.query(query, [id_unico]);
    return rows.length > 0 ? new Mantenimiento(rows[0]) : null;
  }
}

export default Mantenimiento;
