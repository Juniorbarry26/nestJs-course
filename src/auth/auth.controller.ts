import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    headers: {
      'Set-Cookie': { description: 'JWT cookie', schema: { type: 'string' } },
    },
  })
  @Post('change-password')
  async changePassword(userId: number, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }
}
