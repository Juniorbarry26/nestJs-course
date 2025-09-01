import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { DataSource } from 'typeorm';

dotenvExpand.expand(dotenv.config());

const user = process.env.DATASOURCE_USERNAME;
const password = process.env.DATASOURCE_PASSWORD;
const host = process.env.DATASOURCE_HOST;
const port = process.env.DATASOURCE_PORT;
const name = process.env.DATASOURCE_DATABASE;

export default new DataSource({
  type: 'postgres',
  host,
  port: Number(port),
  username: user,
  password,
  database: name,
  entities: ['dist/domain/**/*.entity.js'],
  migrations: ['dist/database/migration/*.js'],
});
