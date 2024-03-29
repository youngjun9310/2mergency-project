import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { Users } from './users/entities/user.entity';
import { SchedulesModule } from './schedules/schedules.module';
import { ScheduleMembersModule } from './schedule-members/schedule-members.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { FollowsModule } from './follows/follows.module';
import { RecordsModule } from './records/records.module';
import { GroupMembersModule } from './group-members/group-members.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [Users],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      JWT_SECRET_KEY: Joi.string().required(),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_NAME: Joi.string().required(),
      DB_SYNC: Joi.boolean().required(),
    }),
  }),
  TypeOrmModule.forRootAsync(typeOrmModuleOptions),
  AuthModule,
  PostsModule,
  UsersModule,
  GroupsModule,
  SchedulesModule,
  ScheduleMembersModule,
  PostCommentsModule,
  FollowsModule,
  RecordsModule,
  GroupMembersModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
