import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports : [PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_SECRET_KEY'),
    }),
    inject: [ConfigService],
  }),
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
