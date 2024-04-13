import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { ScheduleMembersModule } from 'src/schedule-members/schedule-members.module';
import { ScheduleMembersService } from 'src/schedule-members/schedule-members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedules, Groups, GroupMembers]),
    ScheduleMembersModule,
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
