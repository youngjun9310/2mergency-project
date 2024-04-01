import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { User } from 'src/utils/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}


  @ApiTags('group-members')
  @ApiOperation({ summary: '그룹 맴버 모든 목록 조회 API', description: '그룹의 권한 있는 목록만 조회' })
  @ApiCreatedResponse({ description: '그룹 맴버 조회'})
  @Get()
  findAll() {
    return this.groupMembersService.findAll();
  }

  @ApiTags('group-members')
  @ApiOperation({ summary: '그룹 맴버 상세 조회 API', description: '그룹의 권한 있는 목록만 조회' })
  @ApiCreatedResponse({ description: '그룹 맴버 조회'})
  @Get(':id')
  findOne(@Param('id') groupMemberId: number) {
    return this.groupMembersService.findOne(groupMemberId);
  }

  @Patch(':id')
  update(@Param('id') groupMemberId: number, @Body() updateGroupMemberDto: UpdateGroupMemberDto, @User() user : Users, userId : bigint) {
    return this.groupMembersService.groupinvite(groupMemberId, user, userId ,updateGroupMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') groupMemberId: number) {
    return this.groupMembersService.remove(groupMemberId);
  }
}
