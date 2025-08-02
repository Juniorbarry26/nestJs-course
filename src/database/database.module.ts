import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'Avond778@',
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
