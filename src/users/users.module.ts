import { Module, forwardRef  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AwsModule } from 'src/aws/aws.module';
import { RoleStrategy } from 'src/auth/strategy/roles.strategy';
import { ENV_JWT_SECRET_KEY } from 'src/const/env.keys';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { GroupsModule,  } from 'src/groups/groups.module';
import { GroupsService } from 'src/groups/groups.service';
import { Groups } from 'src/groups/entities/group.entity';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(ENV_JWT_SECRET_KEY),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Groups]),
    AwsModule,
    GroupsModule
  ],
  providers: [JwtStrategy, UsersService, RoleStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
