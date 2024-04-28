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
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '그룹 생성 API', description: '그룹을 생성한다.' })
  @ApiBearerAuth('access-token')
  @Post()
  async createGroup(@Body() createGroupDto: CreateGroupDto, @UserInfo() users: Users) {
    return await this.groupsService.createGroup(createGroupDto, users.userId);
  }

  // 그룹 모든 목록 조회 //
  @ApiOperation({
    summary: '그룹 모든 목록 조회 API',
    description: '그룹의 모든 목록을 조회',
  })
  @ApiResponse({
    description: '성공적으로 그룹 조회를 하였습니다.',
    status: 200,
  })
  @Get()
  async findAllGroups() {
    return await this.groupsService.findAllGroups();
  }

  // 그룹 상세 조회 //
  @ApiOperation({
    summary: '그룹 상세 조회 API',
    description: '특정 그룹의 상세 정보를 조회',
  })
  @ApiResponse({
    description: '성공적으로 그룹의 상세 정보를 조회하였습니다.',
    status: 200,
  })
  @ApiResponse({
    description: '그룹이 존재하지 않습니다.',
    status: 404,
  })
  @ApiResponse({
    description: '유효하지 않은 그룹 ID입니다.',
    status: 400,
  })
  @Get(':groupId')
  async findOneGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupsService.findOneGroup(groupId);
  }

  // 그룹 수정 //
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Patch(':groupId')
  async updateGroup(@Param('groupId') groupId: number, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.groupsService.updateGroup(groupId, updateGroupDto);
  }

  // 그룹 삭제 //
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiOperation({ summary: '그룹 삭제 API', description: '그룹을 삭제합니다.' })
  @ApiResponse({
    description: '성공적으로 그룹을 삭제하였습니다.',
    status: 201,
  })
  @ApiBearerAuth('access-token')
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: number) {
    return await this.groupsService.deleteGroup(groupId);
  }

  /** hbs 양식 */
  // 그룹 생성
  @UseGuards(JWTAuthGuard)
  @Get('/groups_h/groupcreate')
  @Render('groupcreate')
  async groupcreate(@UserInfo() users : Users) {
    return{
      users : users
    };
  }

  // 그룹 모든 목록 조회
  @Get('/groups_h/groupall')
  @Render('groupall')
  async groupsall(@UserInfo() users : Users, groupId : number) {
    const groups = await this.groupsService.findAllGroups();
    return {
      groups: groups,
      users : users,
      groupId : groupId
    };
  }

  // 그룹 상세 목록 조회, 스케줄 상세 조회
  @Get('/:groupId/groups_h/grouplist')
  @Render('grouplist')
  async grouplist(@Param('groupId') groupId: number, scheduleId: number, @UserInfo() users : Users) {
    const groups = await this.groupsService.findOneGroup(groupId);
    return {
      groups: groups,
      scheduleId: scheduleId,
      users : users
    };
  }

  // 그룹 수정
  @UseGuards(JWTAuthGuard, memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get('/:groupId/groups_h/groupEdit')
  @Render('groupEdit')
  async groupEditpage(@Param('groupId') groupId: number, @UserInfo() users : Users) {
    return {
      groupId: groupId,
      users : users
    };
  }
}