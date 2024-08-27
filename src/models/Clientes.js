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
      SET correo = COALESCE($1, correo), nombre = COALESCE($2, nombre), telefono = COALESCE($3, telefono)
      WHERE id = $4
      RETURNING *`;
    const values = [correo || null, nombre, telefono, id];
    const { rows } = await pool.query(query, values);
    return new Cliente(rows[0]);
  }

  static async delete(id) {
    const query = 'DELETE FROM Clientes WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? new Cliente(rows[0]) : null;
  }

  static async findAll() {
    const query = `
      SELECT *
      FROM Clientes`;
    const { rows } = await pool.query(query);
    return rows;
  }
}

export default Cliente;
