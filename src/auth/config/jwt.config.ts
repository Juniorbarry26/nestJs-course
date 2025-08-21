import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', (): JwtModuleOptions => {
  const config: JwtModuleOptions = {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: process.env.JWT_TTL,
    },
  };

  return config;
});
