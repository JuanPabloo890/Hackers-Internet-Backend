import pool from '../database.js';

class Cliente {
  constructor({ id, correo, nombre, telefono, password }) {
    this.id = id;
    this.correo = correo;
    this.nombre = nombre;
    this.telefono = telefono;
    this.password = password;
  }

  static async create(clienteData) {
    const { correo, nombre, telefono, password } = clienteData;
    const query = `
      INSERT INTO Clientes (correo, nombre, telefono, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [correo, nombre, telefono, password];
    const { rows } = await pool.query(query, values);
    return new Cliente(rows[0]);
  }

  static async findById(id) {
    const query = 'SELECT * FROM Clientes WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return new Cliente(rows[0]);
    }
    return null;
  }

  static async findByCorreo(correo) {
    const query = 'SELECT * FROM Clientes WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    if (rows.length > 0) {
      return new Cliente(rows[0]);
    }
    return null;
  }

  static async update(id, clienteData) {
    const { correo, nombre, telefono } = clienteData;
    const query = `
      UPDATE Clientes
      SET correo = $1, nombre = $2, telefono = $3
      WHERE id = $4
      RETURNING *`;
    const values = [correo, nombre, telefono, id];
    const { rows } = await pool.query(query, values);
    return new Cliente(rows[0]);
  }

  static async delete(id) {
    const query = 'DELETE FROM Clientes WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? new Cliente(rows[0]) : null;
  }
}

export default Cliente;
