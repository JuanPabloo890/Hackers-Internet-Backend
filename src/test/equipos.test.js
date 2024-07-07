import { jest } from "@jest/globals";
import pool from "../database.js";
import {
  listarEquipos,
  detalleEquipo,
  registrarEquipo,
  actualizarEquipo,
  eliminarEquipo,
  equiposPorEstado,
  equiposPorMarca,
  equiposPorModelo,
  equiposPorIdCliente,
} from "../controllers/equipos_controllers.js";

// Incluir la función generateUniqueId directamente en el archivo de prueba
function generateUniqueId(prefix) {
  const randomNumber = crypto
    .randomBytes(3)
    .toString("hex")
    .substring(0, 6)
    .toUpperCase();
  return `${prefix}${randomNumber}`;
}

// Mockear la función generateUniqueId
jest.mock("../config/password", () => {
  return {
    generateUniqueId: jest.fn().mockImplementation((prefix) => {
      return `${prefix}123456`; // Ejemplo de valor de ID fijo para las pruebas
    }),
  };
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query("BEGIN");
  // Insertar los clientes necesarios para las pruebas
  await pool.query(
    `INSERT INTO Clientes (id, correo, nombre, telefono, password) 
         VALUES (99, 'juan@gmail.com', 'Cliente1', '0987865578', '1234'),
                (148, 'michu@gmail.com', 'Cliente2', '0987865579', '3211')`
  );
});

afterEach(async () => {
  await pool.query("ROLLBACK");
});

describe("Controlador de Equipos", () => {

  it("Debería registrar un nuevo equipo", async () => {
    const req = {
      body: {
        marca: "NuevaMarca",
        modelo: "NuevoModelo",
        estado: "Activo",
        id_cliente: 99,
        observaciones: "Nuevas observaciones",
        tipo: "Impresora",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await registrarEquipo(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        marca: "NuevaMarca",
        modelo: "NuevoModelo",
      })
    );
  });

  it("Debería listar equipos correctamente", async () => {
    console.log("Antes de insertar equipos en la base de datos");
    await pool.query(
      `INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
           VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1'),
                  ('EQ123457', 'Marca2', 'Modelo2', 'Inactivo', 148, 'Observaciones2')`
    );
    console.log("Equipos insertados en la base de datos");

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await listarEquipos(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          marca: "Marca1",
          modelo: "Modelo1",
        }),
        expect.objectContaining({
          marca: "Marca2",
          modelo: "Modelo2",
        }),
      ])
    );
  });

  it("Debería obtener el detalle de un equipo existente", async () => {
    const insertQuery = `
          INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
          VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1')
          RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const equipoId = rows[0].id;

    const req = { params: { id: equipoId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await detalleEquipo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        marca: "Marca1",
        modelo: "Modelo1",
      })
    );
  });

  it("Debería actualizar los datos de un equipo existente", async () => {
    const insertQuery = `
          INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
          VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1')
          RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const equipoId = rows[0].id;

    const req = {
      params: { id: equipoId },
      body: {
        marca: "MarcaActualizada",
        modelo: "ModeloActualizado",
        estado: "Inactivo",
        id_cliente: 148,
        observaciones: "Observaciones actualizadas",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarEquipo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        marca: "MarcaActualizada",
        modelo: "ModeloActualizado",
      })
    );
  });

  it("Debería eliminar un equipo existente", async () => {
    const insertQuery = `
          INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
          VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1')
          RETURNING id`;
    const { rows } = await pool.query(insertQuery);
    const equipoId = rows[0].id;

    const req = { params: { id: equipoId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await eliminarEquipo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Equipo eliminado exitosamente",
    });
  });

  it("Debería listar equipos por estado correctamente", async () => {
    // Insertar equipos de prueba en la base de datos
    await pool.query(
      `INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
       VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1'),
              ('EQ123457', 'Marca2', 'Modelo2', 'Inactivo', 148, 'Observaciones2')`
    );

    const req = { params: { estado: "Activo" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await equiposPorEstado(req, res);

    console.log("Equipos encontrados:", res.json.mock.calls[0][0]); // Loguear la respuesta recibida

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          marca: "Marca1",
          modelo: "Modelo1",
        }),
      ])
    );
  });

  it("Debería listar equipos por marca correctamente", async () => {
    await pool.query(
      `INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
         VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1'),
                ('EQ123457', 'Marca2', 'Modelo2', 'Inactivo', 148, 'Observaciones2')`
    );

    const req = { params: { marca: "Marca1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await equiposPorMarca(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          modelo: "Modelo1",
        }),
      ])
    );
  });

  it("Debería listar equipos por modelo correctamente", async () => {
    await pool.query(
      `INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
         VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1'),
                ('EQ123457', 'Marca2', 'Modelo2', 'Inactivo', 148, 'Observaciones2')`
    );

    const req = { params: { modelo: "Modelo1" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await equiposPorModelo(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          marca: "Marca1",
        }),
      ])
    );
  });

  it("Debería listar equipos por ID de cliente correctamente", async () => {
    await pool.query(
      `INSERT INTO Equipos (id, marca, modelo, estado, id_cliente, observaciones) 
         VALUES ('EQ123456', 'Marca1', 'Modelo1', 'Activo', 99, 'Observaciones1'),
                ('EQ123457', 'Marca2', 'Modelo2', 'Inactivo', 148, 'Observaciones2')`
    );

    const req = { params: { id_cliente: 99 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await equiposPorIdCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          marca: "Marca1",
          modelo: "Modelo1",
        }),
      ])
    );
  });
});

//FALLOS
describe("Controlador de Equipos - Pruebas de Fallo", () => {

  it("Debería manejar el caso donde un cliente no tiene equipos registrados", async () => {
    const req = { params: { id_cliente: 148 } }; // Cliente que no tiene equipos registrados
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await equiposPorIdCliente(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Cliente no tiene equipos registrados",
    });
  });

  it("Debería fallar al registrar un equipo con datos faltantes", async () => {
    const req = {
      body: {
        marca: "NuevaMarca",
        estado: "Activo",
        id_cliente: 99,
        //observaciones: "Nuevas observaciones",
        tipo: "Impresora",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await registrarEquipo(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400); // Esperamos un error 400 por datos faltantes
    expect(res.json).toHaveBeenCalledWith({ msg: "Datos faltantes para registrar el equipo" });
  });
  
  it("Debería fallar al actualizar un equipo inexistente", async () => {
    const req = {
      params: { id: "EQ987654" }, // ID no existente
      body: {
        marca: "MarcaActualizada",
        modelo: "ModeloActualizado",
        estado: "Inactivo",
        id_cliente: 148,
        observaciones: "Observaciones actualizadas",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await actualizarEquipo(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por equipo no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Equipo no encontrado" });
  });

  it("Debería fallar al eliminar un equipo inexistente", async () => {
    const req = {
      params: { id: "EQ987654" }, // ID no existente
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await eliminarEquipo(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por equipo no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Equipo no encontrado" });
  });
  
  it("Debería fallar al obtener el detalle de un equipo inexistente", async () => {
    const req = {
      params: { id: "EQ987654" }, // ID no existente
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await detalleEquipo(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por equipo no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Equipo no encontrado" });
  });
  
  it("Debería fallar al listar equipos por un estado incorrecto", async () => {
    const req = {
      params: { estado: "EstadoInexistente" }, // Estado que no existe en la base de datos
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await equiposPorEstado(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por estado no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Estado de equipos no encontrado" });
  });
  
  it("Debería fallar al listar equipos por una marca incorrecta", async () => {
    const req = {
      params: { marca: "MarcaInexistente" }, // Marca que no existe en la base de datos
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await equiposPorMarca(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por marca no encontrada
    expect(res.json).toHaveBeenCalledWith({ msg: "Marca de equipos no encontrada" });
  });
  
  it("Debería fallar al listar equipos por un modelo incorrecto", async () => {
    const req = {
      params: { modelo: "ModeloInexistente" }, // Modelo que no existe en la base de datos
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await equiposPorModelo(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por modelo no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Modelo de equipos no encontrado" });
  });
  
  it("Debería fallar al listar equipos por un ID de cliente incorrecto", async () => {
    const req = {
      params: { id_cliente: 999 }, // ID de cliente que no existe en la base de datos
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  
    await equiposPorIdCliente(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404); // Esperamos un error 404 por ID de cliente no encontrado
    expect(res.json).toHaveBeenCalledWith({ msg: "Cliente no tiene equipos registrados" });
  });  

});