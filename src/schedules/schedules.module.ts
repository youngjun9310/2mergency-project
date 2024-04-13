import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedules } from './entities/schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
