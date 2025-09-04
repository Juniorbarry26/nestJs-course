import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/users/entities/user.entity';
import { UsersModule } from '../domain/users/users.module'; // ✅ correct import
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { ValidationMiddleware } from './middleware/login-validation/login-validation.middleware';
import { JwtStragey } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule, // ✅ import UsersModule (provides UsersService)
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    LocalStrategy,
    JwtStragey,
  ],
  exports: [HashingService, AuthService], // ✅ export if needed elsewhere
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    // ✅ apply middleware to login route
    consumer.apply(ValidationMiddleware(LoginDto)).forRoutes('auth/login');
  }
}
