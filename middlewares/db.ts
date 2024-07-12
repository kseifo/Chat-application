import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME!;
const dbUser = process.env.DB_USER!;
const dbPass = process.env.DB_PASS!;
const dbHost = process.env.DB_HOST!;
const dbPort = process.env.DB_PORT!;

export const db = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: parseInt(dbPort, 10),
    dialect: 'mysql'
});