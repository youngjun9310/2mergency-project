import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
// import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';

@UseGuards(JWTAuthGuard)
@ApiTags('ScheduleMember')
@Controller('/groups/:groupId/schedules')
export class ScheduleMembersController {
  constructor(private readonly scheduleMembersService: ScheduleMembersService) {}

  /**
   * 스케줄에 멤버 등록
   
   */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post(':scheduleId/members')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '스케줄에 멤버 등록' })
  @ApiResponse({
    status: 201,
    description: `스케줄에 멤버 등록이 완료되었습니다.`,
  })
  @ApiBearerAuth('access-token')
  async registerScheduleMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body('email') email: string,
  ) {
    return this.scheduleMembersService.registerScheduleMember(groupId, scheduleId, email);
  }

  /**
   * 스케줄에 등록된 멤버 전체 조회
   
   */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(':scheduleId/members')
  @ApiOperation({ summary: '특정 스케줄에 등록된 모든 멤버 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄에 등록된 모든 멤버들의 목록을 반환합니다.',
  })
  @ApiBearerAuth('access-token')
  async findAllMembers(@Param('groupId') groupId: number, @Param('scheduleId') scheduleId: number) {
    return await this.scheduleMembersService.findAllScheduleMembers(groupId, scheduleId);
  }

  /**
   * 스케줄에 등록된 멤버 상세 조회
   
   */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get(':scheduleId/members/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '스케줄에 등록된 멤버 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄에 등록된 멤버 조회가 완료되었습니다.',
  })
  @ApiBearerAuth('access-token')
  async findOneScheduleMembers(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @Param('userId') userId: number,
  ) {
    const member = await this.scheduleMembersService.findOneScheduleMembers(groupId, scheduleId, userId);

    if (!member) {
      throw new NotFoundException('해당 멤버를 찾을 수 없습니다.');
    }

    return {
      message: '스케줄에 등록된 멤버 조회가 완료되었습니다.',
      data: member,
    };
  }

  /**
   * 스케줄에 등록된 멤버 삭제
   
   */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Delete(':scheduleId/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '스케줄에 등록된 멤버 삭제' })
  @ApiResponse({ status: 200, description: '스케줄 멤버 삭제에 성공했습니다.' })
  @ApiBearerAuth('access-token')
  async deleteScheduleMembers(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @Body('email') email: string,
  ) {
    await this.scheduleMembersService.deleteScheduleMembers(groupId, scheduleId, email);

    return {
      message: '스케줄 멤버 삭제에 성공했습니다.',
    };
  }
}
