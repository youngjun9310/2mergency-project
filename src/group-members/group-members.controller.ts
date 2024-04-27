import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
  UnauthorizedException,
  Render,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { MemberRole } from './types/groupMemberRole.type';
import { MemberRoles } from './decorator/memberRoles.decorator';
import { GroupMembers } from './entities/group-member.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { memberRolesGuard } from './guard/members.guard';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';

@UseGuards(JWTAuthGuard)
@ApiTags('GroupMember')
@Controller('groups')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  /**
   * 그룹에 멤버 초대
   */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post(':groupId/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹에 멤버 초대 API', description: '그룹에 멤버 초대 성공' })
  @ApiResponse({ status: 201, description: '성공적으로 초대를 완료했습니다.' })
  @ApiBearerAuth('access-token')
  async inviteUserToGroup(
    @Param('groupId') groupId: number,
    @UserInfo() users: Users,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    const { email } = inviteMemberDto;

    await this.groupMembersService.inviteUserToGroup(groupId, users.userId, email);
    return {
      message: '초대를 완료했습니다.',
    };
  }

  /**
   * 유저가 그룹 초대 수락
   * @returns
   */

  @Post(':groupId/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용자가 그룹 초대를 수락 API', description: '그룹 초대 수락 성공' })
  @ApiResponse({ status: 200, description: '초대를 수락했습니다.' })
  @ApiBearerAuth('access-token')
  async acceptInvitation(
    @Param('groupId', ParseIntPipe) groupId: number,
    @UserInfo() currentUser: Users,
    @Body('email') email: string,
  ): Promise<any> {
    if (currentUser.email !== email) {
      throw new UnauthorizedException(
        `${email} 주소가 현재 로그인한 사용자의 이메일${currentUser.email}과 일치하지 않습니다.`,
      );
    }
    return this.groupMembersService.acceptInvitation(groupId, currentUser.userId, email);
  }

  /**
   * 사용자가 그룹의 멤버인지 확인
   * **/

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get(':groupId/members/:userId')
  @ApiOperation({ summary: '사용자가 그룹의 멤버인지 확인 API', description: '사용자가 그룹 멤버인지 확인 성공' })
  @ApiResponse({ status: 200, description: '사용자는 그룹의 멤버입니다.' })
  @ApiBearerAuth('access-token')
  async isGroupMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    const memberDetails = await this.groupMembersService.isGroupMemberDetailed(groupId, userId);

    if (!memberDetails) {
      throw new NotFoundException(`해당 사용자 또는 그룹이 데이터 베이스에 존재하지 않습니다.`);
    }

    if (!memberDetails.groups || !memberDetails.users) {
      throw new NotFoundException(`해당 사용자 또는 그룹이 정보의 연결이 데이터베이스에 완전히 형성되지 않았습니다.`);
    }
    return { message: `${userId}는 그룹 ${groupId}의 멤버입니다.` };
  }

  /**
   * 특정 사용자의 그룹 멤버 정보 조회
   * */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(':groupId/users/:userId')
  @ApiOperation({ summary: '사용자와 그룹의 관련된 정보 조회 API', description: '사용자의 그룹 멤버 정보 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 그룹 멤버의 상세 정보를 조회하였습니다.' })
  @ApiBearerAuth('access-token')
  async findByUserAndGroup(@Param('userId') userId: number, @Param('groupId') groupId: number): Promise<GroupMembers> {
    return await this.groupMembersService.findByUserAndGroup(userId, groupId);
  }

  /**
   * 해당 그룹의 멤버 전체 조회
   * */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(':groupId/members')
  @ApiOperation({
    summary: '그룹에 등록된 전체 사용자 목록 조회 API',
    description: '그룹에 등록된 전체 사용자 목록 조회 성공',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 그룹 멤버 전체 조회를 완료 하였습니다.',
    type: GroupMembers,
    isArray: true,
  })
  @ApiBearerAuth('access-token')
  async getAllGroupMembers(@Param('groupId', ParseIntPipe) groupId: number): Promise<GroupMembers[]> {
    return this.groupMembersService.getAllGroupMembers(groupId);
  }

  /** hbs 양식 */
  // 그룹 맴버 초대
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get('/:groupId/invite/group-members_h/groupinvite')
  @Render('groupinvite')
  async groupinvite(@Param('groupId') groupId: number) {
    return {
      groupId: groupId,
    };
  }

  // 그룹 맴버 수락
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get('/:groupId/accept/group-members_h/groupaccept')
  @Render('groupaccept')
  async groupaccept(@Param('groupId') groupId: number) {
    return {
      groupId: groupId,
    };
  }
}
