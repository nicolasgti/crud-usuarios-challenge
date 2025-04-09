import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'crud_usuarios',
  entities: [path.resolve(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.resolve(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false, // Use false em produção
});