// import 'reflect-metadata';
// import { app-admin } from 'dotenv';
// import { DataSource, DataSourceOptions } from 'typeorm';
//
// app-admin();
//
// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT ?? '5432') ?? 5432,
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'postgres',
//   database: process.env.DB_NAME || 'school_management',
//   synchronize: process.env.NODE_ENV === 'development',
//   logging: process.env.NODE_ENV === 'development',
//   entities: [__dirname + '/entity/**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
//   migrationsTableName: 'migrations',
// };
//
// const dataSource = new DataSource(dataSourceOptions);
//
// export default dataSource;

import { config } from "dotenv";
import path from "node:path";
import * as process from "node:process";
import { DataSource } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import type { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

config({
  path: [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "..", "..", ".env"),
  ],
});

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: ["src/database/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
  seeds: ["src/database/seeders/*.ts"],
  factories: ["src/database/factories/*.ts"],
} as DataSourceOptions & SeederOptions);
