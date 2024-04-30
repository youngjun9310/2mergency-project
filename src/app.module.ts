import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ScheduleMembersModule } from './schedule-members/schedule-members.module';
import { RecordsModule } from './records/records.module';
import { GroupMembersModule } from './group-members/group-members.module';
import { MailModule } from './mail/mail.module';
import { ENV_DB_HOST, ENV_DB_NAME, ENV_DB_PASSWORD, ENV_DB_PORT, ENV_DB_SYNC, ENV_DB_USERNAME } from './const/env.keys';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    username: configService.get<string>(ENV_DB_USERNAME),
    password: configService.get<string>(ENV_DB_PASSWORD),
    host: configService.get<string>(ENV_DB_HOST),
    port: configService.get<number>(ENV_DB_PORT),
    database: configService.get<string>(ENV_DB_NAME),
    entities: ['dist/**/**.entity{.ts,.js}'],
    synchronize: configService.get<boolean>(ENV_DB_SYNC),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
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
    UsersModule,
    GroupsModule,
    SchedulesModule,
    ScheduleMembersModule,
    RecordsModule,
    GroupMembersModule,
    MailModule,
    AwsModule,
    NestjsFormDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
