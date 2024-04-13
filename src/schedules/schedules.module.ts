import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';

import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules, Groups, GroupMembers, Users])],
  controllers: [SchedulesController],
  providers: [SchedulesService, GroupMembersService, UsersService, MailService],
})
export class SchedulesModule {}
