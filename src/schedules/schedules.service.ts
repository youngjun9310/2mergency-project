import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private ScheduleRepository: Repository<Schedules>,
  ) {}
}
