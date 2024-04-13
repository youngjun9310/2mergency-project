import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/schedule.dto';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';

@Controller('groups/:groupId')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @UseGuards(AuthGuard('jwt'), memberRolesGuard)
  @MemberRoles(MemberRole.Admin)
  @Post('/schedules')
  async createSchedule(
    @Body() createScheduleDto: ScheduleDto,
    @UserInfo() users: Users,
    @Param('groupId') groupId: number,
  ) {
    return await this.schedulesService.createSchedule(
      createScheduleDto,
      groupId,
      users.userId,
    );
  }

  // 스케쥴 전체 조회
  @UseGuards(AuthGuard('jwt'))
  @Get('/schedules')
  async getAllSchedule(@Param('groupId') groupId: number) {
    return this.schedulesService.getAllSchedule(groupId);
  }

  // 스케쥴 상세 조회
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Main)
  @Get('/schedules/:scheduleId')
  async getOneSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @UserInfo() users: Users,
  ) {
    return await this.schedulesService.getOneSchedule(
      groupId,
      scheduleId,
      users.userId,
    );
  }

  // 스케쥴 수정
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Main)
  @Patch('schedules/:scheduleId')
  async changeSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @Body() changeScheduleDto: ScheduleDto,
  ) {
    return await this.schedulesService.changeSchedule(
      changeScheduleDto,
      groupId,
      scheduleId,
    );
  }

  // 스케쥴 삭제
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin)
  @Delete('/schedules/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduled: number) {
    return await this.schedulesService.deleteSchedule(scheduled);
  }
}
