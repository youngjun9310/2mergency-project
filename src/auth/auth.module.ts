import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Invites } from './entities/invite.entity';
import { MailModule } from 'src/mail/mail.module';
import { AwsModule } from 'src/aws/aws.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { ENV_JWT_SECRET_KEY } from 'src/const/env.keys';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RoleStrategy } from './strategy/roles.strategy';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_JWT_SECRET_KEY),
        signOptions: {
          expiresIn: '12h',
        },
      }),
    }),
    TypeOrmModule.forFeature([Users, Invites]),
    UsersModule,
    MailModule,
    AwsModule,
    NestjsFormDataModule,
  ],

  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, RoleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
