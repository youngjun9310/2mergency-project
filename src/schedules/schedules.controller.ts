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

@Controller('groups/:groupId')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @Post('schedules')
  async createSchedule(
    @Body() createScheduleDto: ScheduleDto,
    @Body('userId') userId: number,
    @Param('groupId') groupId: number,
    
  ) {
    return await this.schedulesService.createSchedule(
      createScheduleDto,
      groupId,
      userId,
    );
  }

  // 스케쥴 전체 조회
  @Get('schedules')
  async getAllSchedule(@Param('groupId') groupId: number) {
    return this.schedulesService.getAllSchedule(groupId);
  }

  // 스케쥴 상세 조회
  @Get('schedules/:schedulesId')
  async getOneSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
  ) {
    return await this.schedulesService.getOneSchedule(groupId, scheduleId);
  }

  // 스케쥴 수정
  @Patch('schedules/:scheduleId')
  changeSchedule(
    @Param('schedulesId') scheduleId: number,
    @Body() changeScheduleDto: ScheduleDto,
  ) {
    return this.schedulesService.changeSchedule(changeScheduleDto, scheduleId);
  }

  // 스케쥴 삭제
  @Delete('schedules/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduled: number) {
    return await this.schedulesService.deleteSchedule(scheduled);
  }
}