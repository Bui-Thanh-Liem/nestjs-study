import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';
import { join } from 'path';

//
const isProduction = process.env.NODE_ENV === 'prod';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

//
export const config: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME || 'dev.sqlite',
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/*.js')],
  migrationsTableName: 'migrations',
  migrationsRun: false, // Tự động chạy migration khi khởi động ứng dụng
  synchronize: !isProduction,
  logging: ['error', 'warn', 'migration'],
};

//
export default registerAs('sqlite', () => config);
