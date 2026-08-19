'use strict';

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ─── PostgreSQL (Auth & Users & Products) ───────────────────────────────────
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_SQL_LOGGING === 'true' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL | Conectado a PostgreSQL');

    if (process.env.NODE_ENV === 'development') {
      const syncLogging = process.env.DB_SQL_LOGGING === 'true' ? console.log : false;
      await sequelize.sync({ force: false, logging: syncLogging });
      console.log('PostgreSQL | Esquema sincronizado en desarrollo');
    }
  } catch (error) {
    console.error(`Error al conectar PostgreSQL: ${error}`);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Closing database connections...`);
  try {
    await sequelize.close();
    console.log('Database connections closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
