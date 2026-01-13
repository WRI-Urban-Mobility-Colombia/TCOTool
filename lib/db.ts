import { Pool } from 'pg';

const dbPoolInstance: { pool: Pool | null } = {
  pool: null,
};

export function getPool(): Pool {
  if (!dbPoolInstance.pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está configurada en las variables de entorno');
    }

    dbPoolInstance.pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return dbPoolInstance.pool;
}
