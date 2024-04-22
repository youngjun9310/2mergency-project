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
  Render,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JWTAuthGuard)
@ApiTags('Schedules')
@Controller('groups/:groupId/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Post()
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
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Get()
  async getAllSchedule(@Param('groupId') groupId: number) {
    console.log(groupId);
    return this.schedulesService.getAllSchedule(groupId);
  }

  // 스케쥴 상세 조회
  @Get('/:scheduleId')
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @ApiBearerAuth('access-token')
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
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Patch('/:scheduleId')
  changeSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() changeScheduleDto: ScheduleDto,
  ) {
    return this.schedulesService.changeSchedule(changeScheduleDto, scheduleId);
  }

  // 스케쥴 삭제
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Delete('/:scheduleId')
  async deleteSchedule(@Param('scheduleId') scheduled: number) {
    return await this.schedulesService.deleteSchedule(scheduled);
  }

  /** hbs 양식 */
  // 스케줄 생성
  @UseGuards(JWTAuthGuard)
  @Get('/schedules_h/schedulecreate')
  @Render('schedulecreate')
  async schedulescreate(){
    return;
  }
}
