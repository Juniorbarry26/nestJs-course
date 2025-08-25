import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from './guards/local-auth/decorators/user.decorator';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RequestUser } from './interface/request-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': { description: 'JWT cookie', schema: { type: 'string' } },
    },
  })
  @ApiOperation({ summary: 'A valid user login' })
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
}
