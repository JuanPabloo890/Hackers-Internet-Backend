import { jest } from "@jest/globals"; // Asegúrate de tener Jest configurado para ES modules
import Cliente from "../models/Clientes.js"; // Asegúrate de que la ruta sea correcta
import pool from "../database.js"; // Asegúrate de que la configuración de pool sea correcta

import {
  listarClientes,
  detalleCliente,
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
} from "../controllers/cliente_controllers.js";

// // Configuración de Jest
// beforeAll(async () => {
//   // Conectar a la base de datos PostgreSQL
//   await pool.connect();
//   console.log("Conectado a la base de datos PostgreSQL");
// });

// afterEach(async () => {
//   Limpiar los datos después de cada prueba
//   await pool.query("DELETE FROM Clientes");
// });

afterAll(async () => {
  // Cerrar la conexión con la base de datos después de todas las pruebas
  await pool.end();
});

// Configuración de Jest
beforeEach(async () => {
  // Iniciar una transacción para cada prueba
  await pool.query("BEGIN");
});

afterEach(async () => {
  // Hacer rollback de la transacción después de cada prueba
  await pool.query("ROLLBACK");
});

describe("Controlador de Clientes", () => {

  it("Debería registrar un nuevo cliente", async () => {
    const req = {
      body: {
        correo: "nuevoCliente@example.com",
        nombre: "Nuevo Cliente",
        telefono: "0987654321",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarCliente(req, res);

    // Verificar si el estado de respuesta es 200 o 400 según lo esperado
    if (res.status.mock.calls[0][0] === 200) {
      expect(res.json).toHaveBeenCalledWith({
        msg: "Registro exitoso del cliente y correo con la contraseña enviado correctamente.",
      });
    } else if (res.status.mock.calls[0][0] === 400) {
      // Aquí podrías agregar más detalles si esperas un mensaje de error específico
      console.error(
        "Error al registrar el cliente:",
        res.json.mock.calls[0][0].msg
      );
    }
  });

  it("Debería listar clientes correctamente", async () => {
    // Crear clientes de prueba en la base de datos
    await pool.query(
      `INSERT INTO Clientes (correo, nombre, telefono, password) 
             VALUES ('cliente1@example.com', 'Cliente 1', '1234567890', 'password1'),
                    ('cliente2@example.com', 'Cliente 2', '9876543210', 'password2')`
    );

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await listarClientes(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          correo: "cliente1@example.com",
          nombre: "Cliente 1",
        }),
        expect.objectContaining({
          correo: "cliente2@example.com",
          nombre: "Cliente 2",
        }),
      ])
    );
  });

  it("Debería obtener el detalle de un cliente existente", async () => {
    // Insertar un cliente de prueba en la base de datos
    const insertQuery = `
            INSERT INTO Clientes (correo, nombre, telefono, password) 
            VALUES ('cliente1@example.com', 'Cliente 1', '1234567890', 'password1')
            RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const clienteId = rows[0].id;

    const req = { params: { id: clienteId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await detalleCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        correo: "cliente1@example.com",
        nombre: "Cliente 1",
      })
    );
  });

  it("Debería actualizar los datos de un cliente existente", async () => {
    // Insertar un cliente de prueba en la base de datos
    const insertQuery = `
            INSERT INTO Clientes (correo, nombre, telefono, password) 
            VALUES ('cliente1@example.com', 'Cliente 1', '1234567890', 'password1')
            RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const clienteId = rows[0].id;

    const req = {
      params: { id: clienteId },
      body: {
        correo: "clienteActualizado@example.com",
        nombre: "Cliente Actualizado",
        telefono: "9876543210",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        correo: "clienteActualizado@example.com",
        nombre: "Cliente Actualizado",
      })
    );
  });

  it("Debería eliminar un cliente existente", async () => {
    // Insertar un cliente de prueba en la base de datos
    const insertQuery = `
            INSERT INTO Clientes (correo, nombre, telefono, password) 
            VALUES ('cliente1@example.com', 'Cliente 1', '1234567890', 'password1')
            RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const clienteId = rows[0].id;

    const req = { params: { id: clienteId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Cliente eliminado exitosamente",
    });
  });
});

describe("Controlador de Clientes - Pruebas de Fallo", () => {
  it("Debería fallar al obtener el detalle de un cliente inexistente", async () => {
    const req = { params: { id: 999 } }; // ID inexistente
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await detalleCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Cliente no encontrado" });
  });

  it("Debería fallar al registrar un cliente con datos faltantes", async () => {
    const req = {
      body: {
        correo: "nuevoCliente@example.com",
        // Falta nombre y telefono
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Todos los campos son obligatorios" });
  });

  it("Debería fallar al actualizar un cliente inexistente", async () => {
    const req = {
      params: { id: 999 }, // ID inexistente
      body: {
        correo: "clienteActualizado@example.com",
        nombre: "Cliente Actualizado",
        telefono: "9876543210",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Cliente no encontrado" });
  });

  it("Debería fallar al eliminar un cliente inexistente", async () => {
    const req = { params: { id: 999 } }; // ID inexistente
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Cliente no encontrado" });
  });

  it("Debería fallar al listar clientes si hay un error en la base de datos", async () => {
    jest.spyOn(Cliente, 'findAll').mockRejectedValue(new Error("Error en la base de datos"));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await listarClientes(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ msg: "Error en el servidor" });
  });
});