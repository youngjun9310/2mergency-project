import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';


@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Get()
  findAll() {
    return this.groupMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') groupMemberId: number) {
    return this.groupMembersService.findOne(groupMemberId);
  }

  @Patch(':id')
  update(@Param('id') groupMemberId: number, @Body() updateGroupMemberDto: UpdateGroupMemberDto, @UserInfo() user : Users, userId : bigint) {
    return this.groupMembersService.groupinvite(groupMemberId, user, userId ,updateGroupMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') groupMemberId: number) {
    return this.groupMembersService.remove(groupMemberId);
  }
}
