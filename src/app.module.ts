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
import { Groups } from './groups/entities/group.entity';
import { GroupMembers } from './group-members/entities/group-member.entity';
import { MailModule } from './mail/mail.module';
import { ENV_DB_HOST, ENV_DB_NAME, ENV_DB_PASSWORD, ENV_DB_PORT, ENV_DB_SYNC, ENV_DB_USERNAME } from './const/env.keys';
import { Posts } from './posts/entities/posts.entity';
import { PostComments } from './post-comments/entities/post-comment.entity';
import { Schedules } from './schedules/entities/schedule.entity';
import { ScheduleMembers } from './schedule-members/entities/schedule-member.entity';
import { Records } from './records/entities/record.entity';
import { Follows } from './follows/entities/follow.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    username: configService.get<string>(ENV_DB_USERNAME),
    password: configService.get<string>(ENV_DB_PASSWORD),
    host: configService.get<string>(ENV_DB_HOST),
    port: configService.get<number>(ENV_DB_PORT),
    database: configService.get<string>(ENV_DB_NAME),
    entities: [ Users, Groups, GroupMembers, Posts, PostComments, Schedules, ScheduleMembers, Records, Follows ],
    synchronize: configService.get<boolean>(ENV_DB_SYNC),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      JWT_SECRET_KEY: Joi.string().required(),
      PASSWORD_HASH_ROUNDS: Joi.number().required(),
      ROLE_ADMIN_PASSWORD: Joi.string().required(),
      MAILER_EMAIL: Joi.string().required(),
      MAILER_PASSWORD: Joi.string().required(),
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
  MailModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
