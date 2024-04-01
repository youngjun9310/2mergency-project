import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
