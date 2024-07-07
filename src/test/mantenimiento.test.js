import { jest } from "@jest/globals";
import pool from "../database.js";
import {
  getMantenimientoById,
  getMantenimientosByEquipoId,
  getAllMantenimientos,
} from "../controllers/mantenimiento_controllers.js";

// Configuración de Jest
beforeEach(async () => {
  // Iniciar una transacción para cada prueba
  await pool.query("BEGIN");

  // Insertar un cliente de prueba
  await pool.query(`
    INSERT INTO Clientes (id, correo, nombre, telefono, password) 
    VALUES (99, 'cliente@example.com', 'Cliente de prueba', '1234567890', 'password')
    ON CONFLICT DO NOTHING
  `);

  // Insertar un equipo de prueba
  await pool.query(`
    INSERT INTO Equipos (id, marca, modelo, estado, id_cliente) 
    VALUES ('EQ123456', 'Marca de prueba', 'Modelo de prueba', 'Activo', 99)
    ON CONFLICT DO NOTHING
  `);
});

afterEach(async () => {
  // Hacer rollback de la transacción después de cada prueba
  await pool.query("ROLLBACK");
});

afterAll(async () => {
  // Cerrar la conexión con la base de datos después de todas las pruebas
  await pool.end();
});

describe("Controlador de Mantenimiento", () => {
  it("Debería obtener el detalle de un mantenimiento existente por su ID", async () => {
    // Insertar un mantenimiento de prueba en la base de datos
    const insertQuery = `
      INSERT INTO Mantenimiento (id_equipo, descripcion, fecha, estado_actual) 
      VALUES ('EQ123456', 'Descripción de prueba', '2023-06-28', 'Activo')
      RETURNING id_unico`;
    const { rows } = await pool.query(insertQuery);
    const mantenimientoId = rows[0].id_unico;

    const req = { params: { id_unico: mantenimientoId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getMantenimientoById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id_unico: mantenimientoId,
        descripcion: "Descripción de prueba",
        estado_actual: "Activo",
      })
    );
  });

  it("Debería obtener todos los mantenimientos por ID de equipo", async () => {
    // Insertar mantenimientos de prueba en la base de datos
    const insertMantenimientoQuery = `
      INSERT INTO Mantenimiento (id_equipo, descripcion, fecha, estado_actual) 
      VALUES 
      ('EQ123456', 'Mantenimiento 1', '2023-06-27', 'Activo'),
      ('EQ123456', 'Mantenimiento 2', '2023-06-28', 'Inactivo')`;
    await pool.query(insertMantenimientoQuery);

    const req = { params: { id_equipo: 'EQ123456' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getMantenimientosByEquipoId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id_equipo: 'EQ123456',
        marca: 'Marca de prueba',
        modelo: 'Modelo de prueba',
        mantenimientos: expect.arrayContaining([
          expect.objectContaining({
            descripcion: 'Mantenimiento 1',
            estado_actual: 'Activo',
          }),
          expect.objectContaining({
            descripcion: 'Mantenimiento 2',
            estado_actual: 'Inactivo',
          }),
        ]),
      })
    );
  });

  it("Debería obtener todos los mantenimientos", async () => {
    // Insertar un cliente y equipo adicional para la prueba
    await pool.query(`
      INSERT INTO Clientes (id, correo, nombre, telefono, password) 
      VALUES (100, 'otrocliente@example.com', 'Otro Cliente', '0987654321', 'password')
      ON CONFLICT DO NOTHING
    `);

    await pool.query(`
      INSERT INTO Equipos (id, marca, modelo, estado, id_cliente) 
      VALUES ('EQ123457', 'Otra Marca', 'Otro Modelo', 'Activo', 100)
      ON CONFLICT DO NOTHING
    `);

    // Insertar mantenimientos de prueba en la base de datos
    const insertMantenimientoQuery = `
      INSERT INTO Mantenimiento (id_equipo, descripcion, fecha, estado_actual) 
      VALUES 
      ('EQ123456', 'Mantenimiento 3', '2023-06-26', 'Activo'),
      ('EQ123456', 'Mantenimiento 4', '2023-06-29', 'Inactivo'),
      ('EQ123457', 'Mantenimiento 5', '2023-06-30', 'Activo')`;
    await pool.query(insertMantenimientoQuery);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAllMantenimientos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          descripcion: 'Mantenimiento 3',
          estado_actual: 'Activo',
        }),
        expect.objectContaining({
          descripcion: 'Mantenimiento 4',
          estado_actual: 'Inactivo',
        }),
        expect.objectContaining({
          descripcion: 'Mantenimiento 5',
          estado_actual: 'Activo',
        }),
      ])
    );
  });
});

describe("Controlador de Mantenimiento - Pruebas de Fallo", () => {
  it("Debería fallar al intentar obtener un mantenimiento inexistente por su ID", async () => {
    const req = { params: { id_unico: '999' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getMantenimientoById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Mantenimiento no encontrado" });
  });

  it("Debería fallar al intentar obtener mantenimientos de un equipo inexistente por su ID", async () => {
    const req = { params: { id_equipo: 'EQ123457' } }; // EQ123457 no existe en la base de datos
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getMantenimientosByEquipoId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Equipo no encontrado o no tiene mantenimientos asociados" });
  });

});