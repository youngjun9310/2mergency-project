import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @Post()
  async createSchedule(
    @Body() createScheduleDto: ScheduleDto,
    @Param('groupId') groupId: number,
  ) {
    return await this.schedulesService.createSchedule(
      createScheduleDto,
      groupId,
    );
  }

  // 스케쥴 전체 조회
  @Get()
  async getAllSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
  ) {
    return this.schedulesService.getAllSchedule(groupId, scheduleId);
  }

  // 스케쥴 상세 조회
  @Get()
  async getOneSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
  ) {
    return await this.schedulesService.getOneSchedule(groupId, scheduleId);
  }

  // 스케쥴 수정
  @Patch()
  changeSchedule(
    @Param('groupId') groupId: number,
    @Param('schedulesId') scheduleId: number,
    @Body() updateScheduleDto: ScheduleDto,
  ) {
    return this.schedulesService.changeSchedule(
      updateScheduleDto,
      groupId,
      scheduleId,
    );
  }

  // 스케쥴 삭제
  @Delete()
  async deleteSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduled: number,
  ) {
    return await this.schedulesService.deleteSchedule(groupId, scheduled);
  }
}
