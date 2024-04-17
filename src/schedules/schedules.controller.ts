import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/create-schedule.dto';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';

@Controller('groups/:groupId')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post('/schedules')
  async createSchedule(
    @Body() createScheduleDto: ScheduleDto,
    @UserInfo() users: Users,
    @Param('groupId') groupId: number,
  ) {
    if (!(users || users.userId)) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const newSchedule = await this.schedulesService.createSchedule(
      createScheduleDto,
      groupId,
      users.userId,
    );

    return newSchedule;
  }

  // 스케쥴 전체 조회
  @Get('/schedules')
  async getAllSchedule(@Param('groupId') groupId: number) {
    return this.schedulesService.getAllSchedule(groupId);
  }

  // 스케쥴 상세 조회
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Patch('schedules/:scheduleId')
  changeSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() changeScheduleDto: ScheduleDto,
    @UserInfo() users: Users,
  ) {
    console.log(users);
    return this.schedulesService.changeSchedule(
      changeScheduleDto,
      scheduleId,
      users.userId,
    );
  }

  // 스케쥴 삭제
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Delete('/schedules/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduled: number) {
    return await this.schedulesService.deleteSchedule(scheduled);
  }
}
