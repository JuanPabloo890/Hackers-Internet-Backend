import { jest } from "@jest/globals";
import pool from "../database.js";
import Administrador from "../models/Administrador.js";
import { loginAdmin, actualizarAdmin, recuperarPassword } from "../controllers/administrador_controllers.js";
import bcrypt from 'bcryptjs';

//////////////// npx jest src/test/administrador.test.js para ejecutar individualmente

// Configuración de Jest
beforeEach(async () => {
  // Iniciar una transacción para cada prueba
  await pool.query("BEGIN");

  // Insertar un administrador de prueba en la base de datos
  await pool.query(`
    INSERT INTO Administrador (id, correo, nombre, telefono, password) 
    VALUES (2, 'admin@example.com', 'Admin Prueba', '1234567890', '${await bcrypt.hash('password', 10)}')
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

describe("Modelo de Administrador", () => {
  it("Debería crear un nuevo administrador", async () => {
    const newAdminData = {
      correo: "nuevoadmin@example.com",
      nombre: "Nuevo Admin",
      telefono: "0987654321",
      password: "newpassword",
    };

    const newAdmin = await Administrador.create(newAdminData);

    expect(newAdmin).toBeInstanceOf(Administrador);
    expect(newAdmin.id).toBeDefined();
    expect(newAdmin.correo).toBe(newAdminData.correo);
    expect(newAdmin.nombre).toBe(newAdminData.nombre);
    expect(newAdmin.telefono).toBe(newAdminData.telefono);
  });

  it("Debería encontrar un administrador por su ID", async () => {
    const foundAdmin = await Administrador.findById(2);

    expect(foundAdmin).toBeInstanceOf(Administrador);
    expect(foundAdmin.id).toBe(2);
    expect(foundAdmin.correo).toBe("admin@example.com");
    expect(foundAdmin.nombre).toBe("Admin Prueba");
    expect(foundAdmin.telefono).toBe("1234567890");
  });

  it("Debería encontrar un administrador por su correo electrónico", async () => {
    const foundAdmin = await Administrador.findByCorreo("admin@example.com");

    expect(foundAdmin).toBeInstanceOf(Administrador);
    expect(foundAdmin.id).toBe(2);
    expect(foundAdmin.correo).toBe("admin@example.com");
    expect(foundAdmin.nombre).toBe("Admin Prueba");
    expect(foundAdmin.telefono).toBe("1234567890");
  });

  it("Debería actualizar los datos de un administrador existente", async () => {
    const adminId = 2;
    const updatedAdminData = {
      correo: "adminactualizado@example.com",
      nombre: "Admin Actualizado",
      telefono: "9876543210",
      password: "updatedpassword",
    };
  
    const hashedPassword = await bcrypt.hash(updatedAdminData.password, 10); // Generar hash de la nueva contraseña
  
    // Actualiza los datos del administrador en la prueba
    const updatedAdmin = await Administrador.update(adminId, {
      correo: updatedAdminData.correo,
      nombre: updatedAdminData.nombre,
      telefono: updatedAdminData.telefono,
      password_hash: hashedPassword,
    });
  
    expect(updatedAdmin).toBeInstanceOf(Administrador);
    expect(updatedAdmin.id).toBe(adminId);
    expect(updatedAdmin.correo).toBe(updatedAdminData.correo);
    expect(updatedAdmin.nombre).toBe(updatedAdminData.nombre);
    expect(updatedAdmin.telefono).toBe(updatedAdminData.telefono);
  });

  it("Debería eliminar un administrador existente", async () => {
    const adminId = 2;
    const deletedAdmin = await Administrador.delete(adminId);

    expect(deletedAdmin).toBeInstanceOf(Administrador);
    expect(deletedAdmin.id).toBe(adminId);
  });
});

//FALLOS
describe("Controladores de Administrador", () => {
  it("Debería autenticar correctamente al administrador", async () => {
    const req = { body: { correo: "admin@example.com", password: "password" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      nombre: "Admin Prueba",
      correo: "admin@example.com",
      telefono: "1234567890",
      id: 2
    });
  });

  it("Debería recuperar la contraseña de un administrador", async () => {
    const req = { body: { correo: "admin@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await recuperarPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ msg: "Revisa tu correo electrónico para obtener tu nueva contraseña temporal" });
  });
});


describe("Modelo de Administrador", () => {
  // Pruebas exitosas (como se muestran arriba)

  it("Debería fallar al crear un nuevo administrador con un correo ya existente", async () => {
    const duplicateAdminData = {
      correo: "admin@example.com", // Correo ya existente
      nombre: "Duplicado Admin",
      telefono: "1111111111",
      password: "duplicatepassword",
    };

    await expect(Administrador.create(duplicateAdminData)).rejects.toThrow();
  });

  it("Debería fallar al encontrar un administrador con un ID no existente", async () => {
    const nonExistentId = 9;

    const foundAdmin = await Administrador.findById(nonExistentId);

    expect(foundAdmin).toBeNull();
  });

  it("Debería fallar al actualizar un administrador con datos inválidos", async () => {
    const adminId = 3;
    const invalidUpdatedData = {
      correo: "invalidemail", // Correo inválido
      nombre: "Admin Actualizado",
      telefono: "09878", // Teléfono inválido
      password: "short", // Contraseña demasiado corta
    };

    await expect(Administrador.update(adminId, invalidUpdatedData)).rejects.toThrow();
  });
});

describe("Controladores de Administrador", () => {
  // Pruebas exitosas (como se muestran arriba)

  it("Debería fallar al autenticar con una contraseña incorrecta", async () => {
    const req = { body: { correo: "admin@example.com", password: "wrongpassword" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Contraseña incorrecta" });
  });

  it("Debería fallar al actualizar un administrador inexistente", async () => {
    const adminId = 9;
    const updatedAdminData = {
      correo: "nonexistent@example.com",
      nombre: "Non Existent",
      telefono: "0000000000",
      password: "doesnotmatter",
    };

    const req = {
      params: { id: adminId },
      body: updatedAdminData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await actualizarAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Administrador no encontrado" });
  });

  it("Debería fallar al recuperar la contraseña con un correo no registrado", async () => {
    const req = { body: { correo: "nonexistent@example.com" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await recuperarPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  });
});