import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Invites } from './entities/invite.entity';
import { MailModule } from 'src/mail/mail.module';
import { AwsModule } from 'src/aws/aws.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { RoleStrategy } from './strategy/roles.strategy';
import { RolesGuard } from './guard/roles.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
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
  providers: [JwtStrategy, AuthService, RoleStrategy, RolesGuard],
})
export class AuthModule {}
