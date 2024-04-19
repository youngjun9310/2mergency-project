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
} from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
// import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';

@UseGuards(JWTAuthGuard)
@ApiTags('ScheduleMember')
@Controller('/groups/:groupId/schedules')
export class ScheduleMembersController {
  constructor(
    private readonly scheduleMembersService: ScheduleMembersService,
    private readonly groupMembersService: GroupMembersService,
  ) {}

  /**
   * 스케줄에 멤버 등록
   * @returns
   */
  // @UseGuards(memberRolesGuard)
  // @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post(':scheduleId/members/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '스케줄에 멤버 등록' })
  @ApiResponse({
    status: 201,
    description: `스케줄에 멤버 등록이 완료되었습니다.`,
  })
  @ApiBearerAuth('access-token')
  async registerScheduleMember(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @UserInfo() users: Users,
    @Body() updateScheduleMemberDto: UpdateScheduleMemberDto,
  ) {
    // 사용자가 그룹 멤버라면, 스케줄 멤버로 등록하기
    const newScheduleMember =
      await this.scheduleMembersService.registerScheduleMember(
        groupId,
        scheduleId,
        users.userId,
        updateScheduleMemberDto.email,
      );

    return newScheduleMember;
  }

  /**
   * 스케줄에 등록된 멤버 전체 조회
   * @returns
   */

  // @UseGuards(memberRolesGuard)
  // @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(':scheduleId/members')
  @ApiOperation({ summary: '특정 스케줄에 등록된 모든 멤버 조회' })
  @ApiResponse({
    status: 200,
    description: '스케줄에 등록된 모든 멤버들의 목록을 반환합니다.',
  })
  @ApiBearerAuth('access-token')
  async findAllMembers(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
  ) {
    return await this.scheduleMembersService.findAllScheduleMembers(
      groupId,
      scheduleId,
    );
  }

  /**
   * 스케줄에 등록된 멤버 상세 조회
   * @returns
   */

  // @UseGuards(memberRolesGuard)
  // @MemberRoles(MemberRole.Admin, MemberRole.Main)
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
    const member = await this.scheduleMembersService.findOneScheduleMembers(
      groupId,
      scheduleId,
      userId,
    );

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
   * @returns
   */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Delete(':scheduleId/members/:userId')
  @HttpCode(HttpStatus.OK) // 성공적으로 처리, 응답 본문에 데이터가 포함되지 않을 때 사용하는 상태 코드
  @ApiOperation({ summary: '스케줄에 등록된 멤버 삭제' })
  @ApiResponse({ status: 200, description: '스케줄 멤버 삭제에 성공했습니다.' })
  @ApiBearerAuth('access-token')
  async deleteScheduleMembers(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @Param('userId') userId: number,
  ) {
    await this.scheduleMembersService.deleteScheduleMembers(
      groupId,
      scheduleId,
      userId,
    );

    return {
      message: '스케줄 멤버 삭제에 성공했습니다.',
    };
  }
}
