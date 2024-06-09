import pool from '../database.js';

class Equipo {
  constructor({ id, marca, modelo, estado, id_cliente, nombre_cliente, observaciones }) {
    this.id = id;
    this.marca = marca;
    this.modelo = modelo;
    this.estado = estado;
    this.id_cliente = id_cliente;
    this.nombre_cliente = nombre_cliente; 
    this.observaciones = observaciones;
  }

  static async create(equipoData) {
    const { marca, modelo, estado, id_cliente, observaciones } = equipoData;
    const query = `
      INSERT INTO Equipos (marca, modelo, estado, id_cliente, observaciones)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [marca, modelo, estado, id_cliente, observaciones];
    const { rows } = await pool.query(query, values);
    return new Equipo(rows[0]);
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
    const values = [marca, modelo, estado, id_cliente,observaciones, id ];
    const { rows } = await pool.query(query, values);
    return new Equipo(rows[0]);
  }

  static async delete(id) {
    const query = 'DELETE FROM Equipos WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? new Equipo(rows[0]) : null;
  }

  static async findAll() {
    const query = `
      SELECT Equipos.*, Clientes.nombre AS nombre_cliente
      FROM Equipos
      JOIN Clientes ON Equipos.id_cliente = Clientes.id`;
    const { rows } = await pool.query(query);
    return rows.map(row => new Equipo(row));
  }

}

export default Equipo;
