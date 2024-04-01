import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ENV_JWT_SECRET_KEY } from 'src/const/env.keys';

@Module({
  imports : [TypeOrmModule.forFeature([Users]),
  PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>(ENV_JWT_SECRET_KEY),
      signOptions : { expiresIn : '12h'},
    }),
    inject: [ConfigService],
  }),
],
  controllers: [AuthController],
  providers: [AuthService],
  exports : [AuthService]
})
export class AuthModule {}
