import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import { DatabaseFilterFilter } from './exception-filters/database-filter/database-filter.filter';
import { NotFoundExceptionFilter } from './exception-filters/not-found-exception/not-found-exception.filter';
import { SeedingModule } from './seeding/seeding.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseFilterFilter,
    },
  ],
  imports: [
    // Load database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        autoLoadEntities: true,
        synchronize: true, // Only for development; remove in production
      }),
    }),
    // Optional: seeding module for initial data
    SeedingModule,
  ],
})
export class DatabaseModule {}
