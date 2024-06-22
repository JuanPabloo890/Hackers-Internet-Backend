import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();

let pool;

try {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.on('connect', () => {
    console.log('Conectado a la base de datos PostgreSQL');
  });
} catch (err) {
  console.error('Error al conectar a la base de datos PostgreSQL', err);
}


// try {
//   pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     ssl: true
//   });

//   pool.on('connect', () => {
//     console.log('Conectado a la base de datos PostgreSQL');
//   });
// } catch (err) {
//   console.error('Error al conectar a la base de datos PostgreSQL', err);
// }

export default pool;
