import { Module } from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { ScheduleMembersController } from './schedule-members.controller';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { ScheduleMembers } from './entities/schedule-member.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupMembersModule } from 'src/group-members/group-members.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedules,
      ScheduleMembers,
      Groups,
      GroupMembers,
    ]),
    GroupMembersModule,
    UsersModule,
  ],
  controllers: [ScheduleMembersController],
  providers: [ScheduleMembersService],
})
export class ScheduleMembersModule {}
