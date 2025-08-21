import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber], // ✅ subscriber registered
})
export class UsersModule {}
