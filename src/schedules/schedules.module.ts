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
import { AwsService } from 'src/aws/aws.service';
import { MembersRoleStrategy } from 'src/group-members/strategies/members.strategy';
import { ScheduleMembers } from 'src/schedule-members/entities/schedule-member.entity';
import { Records } from 'src/records/entities/record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedules,
      Groups,
      GroupMembers,
      Users,
      ScheduleMembers,
      Records
    ]),
  ],
  controllers: [SchedulesController],
  providers: [
    SchedulesService,
    GroupMembersService,
    UsersService,
    MailService,
    AwsService,
    MembersRoleStrategy,
  ],
})
export class SchedulesModule {}
