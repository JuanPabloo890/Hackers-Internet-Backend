import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

//CONECTARSE DESDE EL RENDER
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   }
// });

// pool.on('connect', () => {
//   console.log('Conectado a la base de datos PostgreSQL');
// });

// pool.on('error', (err) => {
//   console.error('Error al conectar a la base de datos PostgreSQL', err);
// });

//CONECTARSE LOCALMENTE

let pool;

try {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false // Esto es para aceptar cualquier certificado. En producción, usa certificados verificados.
    }
  });
  

  pool.on('connect', () => {
    console.log('Conectado a la base de datos PostgreSQL');
  });
} catch (err) {
  console.error('Error al conectar a la base de datos PostgreSQL', err);
}

export default pool;
