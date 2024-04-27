import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Render } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // 그룹 생성 //
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: '그룹 생성 API', description: '그룹 생성 성공' })
  @ApiResponse({ status: 201, description: '성공적으로 그룹이 생성되었습니다.' })
  @ApiBearerAuth('access-token')
  @Post('')
  async createGroup(@Body() createGroupDto: CreateGroupDto, @UserInfo() users: Users) {
    return await this.groupsService.createGroup(createGroupDto, users.userId);
  }

  // 그룹 모든 목록 조회 //
  @ApiOperation({ summary: '모든 그룹 목록 조회 API', description: '모든 그룹 목록 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 그룹 목록이 조회되었습니다.' })
  @Get('')
  async findAllGroups() {
    return await this.groupsService.findAllGroups();
  }

  // 그룹 상세 조회 //
  @ApiOperation({ summary: '그룹 상세 조회 API', description: '그룹 상세 정보 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 그룹의 상세 정보를 조회하였습니다.' })
  @ApiBearerAuth('access-token')
  @Get('')
  async findOneGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupsService.findOneGroup(groupId);
  }

  // 그룹 수정 //
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiOperation({ summary: '그룹 수정 API', description: '그룹의 목록 수정 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 그룹을 수정하였습니다.' })
  @Patch(':groupId')
  @ApiBearerAuth('access-token')
  async updateGroup(@Param('groupId') groupId: number, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.groupsService.updateGroup(groupId, updateGroupDto);
  }

  // 그룹 삭제 //
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiOperation({ summary: '그룹 삭제 API', description: '그룹 삭제 성공' })
  @ApiResponse({ status: 204, description: '성공적으로 그룹을 삭제하였습니다.' })
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: number) {
    return await this.groupsService.deleteGroup(groupId);
  }

  /** hbs 양식 */
  // 그룹 생성
  @UseGuards(JWTAuthGuard)
  @Get('/groups_h/groupcreate')
  @Render('groupcreate')
  async groupcreate(@UserInfo() users: Users) {
    return {
      users: users,
    };
  }

  // 그룹 모든 목록 조회
  @Get('/groups_h/groupall')
  @Render('groupall')
  async groupsall(@UserInfo() users: Users, groupId: number) {
    const groups = await this.groupsService.findAllGroups();
    return {
      groups: groups,
      users: users,
      groupId: groupId,
    };
  }

  // 그룹 상세 목록 조회, 스케줄 상세 조회
  @Get('/:groupId/groups_h/grouplist')
  @Render('grouplist')
  async grouplist(@Param('groupId') groupId: number, scheduleId: number, @UserInfo() users: Users) {
    const groups = await this.groupsService.findOneGroup(groupId);
    return {
      groups: groups,
      scheduleId: scheduleId,
      users: users,
    };
  }

  // 그룹 수정
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get('/:groupId/groups_h/groupEdit')
  @Render('groupEdit')
  async groupEditpage(@Param('groupId') groupId: number, @UserInfo() users: Users) {
    return {
      groupId: groupId,
      users: users,
    };
  }
}