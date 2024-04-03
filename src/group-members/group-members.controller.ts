import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
<<<<<<< HEAD
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
=======
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvitememberDto } from './dto/invite_member';
>>>>>>> 19c6ad55d19325a1e30ce501203a6b624f57431a
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';


@Controller('groups/:groupId')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}


  @ApiTags('group-members')
  @ApiOperation({ summary: '그룹 맴버 모든 목록 조회 API', description: '그룹의 권한 있는 목록만 조회' })
  @ApiCreatedResponse({ description: '그룹 맴버 조회'})
  @Get()
  async findAll() {
    return await this.groupMembersService.findAll();
  }

  @ApiTags('group-members')
  @ApiOperation({ summary: '그룹 맴버 상세 조회 API', description: '그룹의 권한 있는 목록만 조회' })
  @ApiCreatedResponse({ description: '그룹 맴버 조회'})
  @Get('/groupmember/:id')
  async findOne(@Param('id') groupMemberId: number) {
    return await this.groupMembersService.findOne(groupMemberId);
  }

<<<<<<< HEAD
  @Patch(':id')
  update(@Param('id') groupMemberId: number, @Body() updateGroupMemberDto: UpdateGroupMemberDto, @UserInfo() user : Users, userId : bigint) {
    return this.groupMembersService.groupinvite(groupMemberId, user, userId ,updateGroupMemberDto);
=======
  @UseGuards(AuthGuard('jwt'))
  @Post('invite')
  async invite( groupMemberId: number, groupId : number, @UserInfo() users : Users,  @Body() Invitememberdto : InvitememberDto) {
    return await this.groupMembersService.groupinvite(groupId, groupMemberId , users, Invitememberdto.email);
>>>>>>> 19c6ad55d19325a1e30ce501203a6b624f57431a
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/groupmember/accept')
  async groupaccept(@Body() email : string, token : string) {
    return await this.groupMembersService.accept(email, token);
  }

  @Delete('/groupmember/:id')
  async remove(@Param('id') groupMemberId: number, @UserInfo() users : Users) {
    return await this.groupMembersService.remove(groupMemberId);
  }
}
