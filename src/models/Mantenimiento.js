// models/Mantenimiento.js
import pool from '../database.js';
import { format } from 'date-fns';

class Mantenimiento {
  constructor({ id_unico, id_equipo, descripcion, fecha, marca, modelo, nombre_cliente, telefono, estado }) {
    this.id_unico = id_unico;
    this.id_equipo = id_equipo;
    this.descripcion = descripcion;
    this.fecha = format(new Date(fecha), 'yyyy-MM-dd');
    this.marca = marca;
    this.modelo = modelo;
    this.nombre_cliente = nombre_cliente;
    this.telefono = telefono;
    this.estado = estado;
  }

  static async create(mantenimientoData) {
    const { id_equipo, descripcion, fecha } = mantenimientoData;
    const query = `
      INSERT INTO Mantenimiento (id_equipo, descripcion, fecha)
      VALUES ($1, $2, $3)
      RETURNING *`;
    const values = [id_equipo, descripcion, fecha];
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
      SELECT m.*, e.marca, e.modelo, c.nombre AS nombre_cliente, c.telefono, e.estado
      FROM Mantenimiento m
      JOIN Equipos e ON m.id_equipo = e.id
      JOIN Clientes c ON e.id_cliente = c.id
      WHERE m.id_equipo = $1`;
    const { rows } = await pool.query(query, [id_equipo]);
    return rows.map(row => new Mantenimiento(row));
  }

  static async update(id_unico, mantenimientoData) {
    const { id_equipo, descripcion, fecha } = mantenimientoData;
    const query = `
      UPDATE Mantenimiento
      SET id_equipo = $1, descripcion = $2, fecha = $3
      WHERE id_unico = $4
      RETURNING *`;
    const values = [id_equipo, descripcion, fecha, id_unico];
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
