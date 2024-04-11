import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { GroupMembersService } from 'src/group-members/group-members.service';

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
    @Body('userId') userId: number // Body에서 직접 userId를 추출하기 !
    ) {

    // 사용자가 그룹 멤버라면, 스케줄 멤버로 등록하기
    return this.scheduleMembersService.registerScheduleMember(
      groupId,
      scheduleId,
      userId,
    );
  }

  @Get()
  findAll() {
    return this.scheduleMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleMembersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleMemberDto: UpdateScheduleMemberDto) {
    return this.scheduleMembersService.update(+id, updateScheduleMemberDto);
  }

  @Delete(':id')
  deleteScheduleMembers(@Param('id') id: string) {
    return this.scheduleMembersService.deleteScheduleMembers(+id);
  }
}
