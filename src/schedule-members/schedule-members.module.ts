import { Module } from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { ScheduleMembersController } from './schedule-members.controller';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { ScheduleMembers } from './entities/schedule-member.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MembersRoleStrategy } from 'src/group-members/strategies/members.strategy';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AwsService } from 'src/aws/aws.service';
import { Records } from 'src/records/entities/record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedules, ScheduleMembers, Groups, GroupMembers, Users, Records]),
    GroupMembersModule,
    UsersModule,
    AuthModule
  ],
  controllers: [ScheduleMembersController],
  providers: [ScheduleMembersService, UsersService, AwsService, MembersRoleStrategy],
})
export class ScheduleMembersModule {}
