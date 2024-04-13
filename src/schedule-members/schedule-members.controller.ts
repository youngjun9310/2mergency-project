import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
// import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';

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

  @Post(':scheduleId/members')
  @HttpCode(HttpStatus.CREATED)
  async registerScheduleMember(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @Body('userId') userId: number, // Body에서 직접 userId를 추출하기 !
  ) {
    // 사용자가 그룹 멤버라면, 스케줄 멤버로 등록하기
    await this.scheduleMembersService.registerScheduleMember(
      groupId,
      scheduleId,
      userId,
    );

    return {
      message: '스케줄에 멤버 등록이 완료되었습니다.',
    };
  }

  /**
   * 스케줄에 등록된 멤버 전체 조회
   * @returns
   */

  @Get(':scheduleId/members')
  @HttpCode(HttpStatus.OK)
  async findAllScheduleMembers(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
  ) {
    const members = this.scheduleMembersService.findAllScheduleMembers(
      groupId,
      scheduleId,
    );

    return {
      message: '스케줄에 등록된 멤버들의 조회가 완료되었습니다.',
      data: members,
    };
  }

  /**
   * 스케줄에 등록된 멤버 상세 조회
   * @returns
   */

  @Get(':scheduleId/members/:userId')
  @HttpCode(HttpStatus.OK)
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

  // /**
  //  * 스케줄에 등록된 멤버 수정
  //  * @returns
  //  */

  // @Patch(':scheduleId/members/:userId')
  // @HttpCode(HttpStatus.OK)
  // async updateScheduleMember(
  //   @Param('groupId') groupId: number,
  //   @Param('scheduleId') scheduleId: number,
  //   @Param('userId') userId: number,
  //   @Body() updateScheduleMemberDto: UpdateScheduleMemberDto,
  // ) {
  //   const updateMember = await this.scheduleMembersService.updateScheduleMember(
  //     groupId,
  //     scheduleId,
  //     userId,
  //     updateScheduleMemberDto,
  //   );

  //   return {
  //     message: '스케줄에 등록된 멤버 수정이 완료되었습니다.',
  //     data: updateMember,
  //   };
  // }

  /**
   * 스케줄에 등록된 멤버 삭제
   * @returns
   */

  @Delete(':scheduleId/members/:userId')
  @HttpCode(HttpStatus.OK) // 성공적으로 처리, 응답 본문에 데이터가 포함되지 않을 때 사용하는 상태 코드
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
