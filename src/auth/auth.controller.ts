import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './guards/local-auth/decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RequestUser } from './interface/request-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@User() user: RequestUser) {
    return user;
  }
}
