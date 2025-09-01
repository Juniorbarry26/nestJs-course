import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './guards/local-auth/decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RequestUser } from './interface/request-user.interface';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @User() user: RequestUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.login(user);
    response.cookie('token', token, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() {id}: RequestUser) {
    return this.authService.getProfile(id);
  }
}
