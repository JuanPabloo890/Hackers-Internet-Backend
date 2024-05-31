import pool from '../database.js';

class Administrador {
  constructor({ id, correo, nombre, telefono, password }) {
    this.id = id;
    this.correo = correo;
    this.nombre = nombre;
    this.telefono = telefono;
    this.password = password;
  }

  static async create(adminData) {
    const { correo, nombre, telefono, password } = adminData;
    const query = `
      INSERT INTO Administrador (correo, nombre, telefono, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [correo, nombre, telefono, password];
    const { rows } = await pool.query(query, values);
    return new Administrador(rows[0]);
  }

  static async findById(id) {
    const query = 'SELECT * FROM Administrador WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    if (rows.length > 0) {
      return new Administrador(rows[0]);
    }
    return null;
  }

  static async findByCorreo(correo) {
    const query = 'SELECT * FROM Administrador WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    if (rows.length > 0) {
      return new Administrador(rows[0]);
    }
    return null;
  }

  static async update(id, adminData) {
    const { correo, nombre, telefono, password_hash } = adminData;
    const query = `
      UPDATE Administrador
      SET correo = $1, nombre = $2, telefono = $3, password = $4
      WHERE id = $5
      RETURNING *`;
    const values = [correo, nombre, telefono, password_hash, id];
    const { rows } = await pool.query(query, values);
    return new Administrador(rows[0]);
  }

  static async delete(id) {
    const query = 'DELETE FROM Administrador WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? new Administrador(rows[0]) : null;
  }
}

export default Administrador;