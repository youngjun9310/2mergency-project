import { Module } from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { ScheduleMembersController } from './schedule-members.controller';

@Module({
  controllers: [ScheduleMembersController],
  providers: [ScheduleMembersService],
})
export class ScheduleMembersModule {}
