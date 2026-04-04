import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

//
const isProd = process.env.NODE_ENV === 'prod';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

//
export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT ? +process.env.MYSQL_PORT : 3306,
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DB || 'ecommerce',
  synchronize: !isProd,
  logging: true,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/migrations/*.js'],
  migrationsTableName: 'migrations-storage',
  poolSize: 10,
  connectorPackage: 'mysql2',
  timezone: '+07:00', // Việt Nam
  charset: 'utf8mb4_unicode_ci',
};

export default registerAs('mysql', (): TypeOrmModuleOptions => config);
