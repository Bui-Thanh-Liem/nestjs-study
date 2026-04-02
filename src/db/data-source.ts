import { DataSource } from 'typeorm';
import { config as configSqlite } from '../configs/sqlite.config';

//
export const connectionDataSource = new DataSource(configSqlite);
