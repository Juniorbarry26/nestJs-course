import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', () => {
  const username = process.env.DATASOURCE_USERNAME;
  const password = process.env.DATASOURCE_PASSWORD;
  const host = process.env.DATASOURCE_HOST;
  const port = Number(process.env.DATASOURCE_PORT);
  const database = process.env.DATASOURCE_DATABASE;

  const config: TypeOrmModuleOptions = {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    autoLoadEntities: true,
    synchronize: true, // only for dev, remove in production
  };

  return config;
});
