import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/users/entities/user.entity';
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
  exports: [HashingService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    // ✅ now works because ValidationMiddleware returns a class
    consumer.apply(ValidationMiddleware(LoginDto)).forRoutes('auth/login');
  }
}
