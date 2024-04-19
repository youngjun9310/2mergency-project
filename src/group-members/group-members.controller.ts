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
   * @returns
   */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post(':groupId/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹에 멤버 초대' })
  @ApiResponse({ status: 201, description: '초대를 완료했습니다.' })
  @ApiBearerAuth('access-token')
  async inviteUserToGroup(
    @Param('groupId') groupId: number,
    @UserInfo() users: Users,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    const { email } = inviteMemberDto;
    console.log(users);
    await this.groupMembersService.inviteUserToGroup(
      groupId,
      users.userId,
      email,
    );
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
  @ApiOperation({ summary: '사용자가 그룹 초대를 수락' })
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
    return this.groupMembersService.acceptInvitation(
      groupId,
      currentUser.userId,
      email,
    );
  }

  /**
   * 사용자가 그룹의 멤버인지 확인
   * **/
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get(':groupId/members/:userId')
  @ApiOperation({ summary: '사용자가 그룹의 멤버인지 확인' })
  @ApiResponse({ status: 200, description: '사용자는 그룹의 멤버입니다.' })
  @ApiResponse({
    status: 404,
    description: '사용자 또는 그룹이 존재하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  async isGroupMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    const memberDetails = await this.groupMembersService.isGroupMemberDetailed(
      groupId,
      userId,
    );
    // GroupMembersService의 isGroupMemberDetailed 메서드를 비동기적으로 호출
    // groupId와 userId를 사용하여 데이터베이스에서 GroupMembers 엔티티를 조회
    // 그룹, 사용자의 존재와 해당 사용자가 그룹의 멤버인지 여부를 확인

    if (!memberDetails) {
      throw new NotFoundException(
        `해당 사용자${userId} 또는 그룹${groupId}이 데이터 베이스에 존재하지 않습니다.`,
      );
      // memberDetails 객체가 null 또는 undefined인지 확인함
      // 이 객체가 존재하지 않는다면, 그룹 또는 사용자가 데이터베이스에 없음을 의미
      // groupId 또는 userId에 해당하는 멤버십 데이터 자체가 데이터베이스에 없을 때 발생
    }

    if (!memberDetails.groups || !memberDetails.users) {
      throw new NotFoundException(
        `해당 사용자${userId} 또는 그룹${groupId}이 정보의 연결이 데이터베이스에 완전히 형성되지 않았습니다.`,
      );
      //memberDetails 객체 내의 groups와 users 관계가 제대로 로드되었는지를 확인
      // 데이터는 존재하지만, 그 데이터가 연관된 그룹 또는 사용자와 제대로 연결되지 않았을 경우
    }
    return { message: `사용자${userId}는 그룹 ${groupId}의 멤버입니다.` };
  }

  /**
   * 특정 사용자의 그룹 멤버 정보 조회
   * */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get(':groupId/users/:userId')
  @ApiOperation({ summary: '사용자와 그룹의 관련된 정보 조회' })
  @ApiResponse({ status: 200, description: '그룹 멤버의 상세 정보' })
  @ApiBearerAuth('access-token')
  async findByUserAndGroup(
    @Param('userId') userId: number,
    @Param('groupId') groupId: number,
  ): Promise<GroupMembers> {
    const groupMember = await this.groupMembersService.findByUserAndGroup(
      userId,
      groupId,
    );
    if (!groupMember) {
      throw new NotFoundException(`멤버 정보를 찾을 수 없습니다.`);
    }
    return groupMember;
  }

  /**
   * 해당 그룹의 멤버 전체 조회
   * */
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get(':groupId/members')
  @ApiOperation({ summary: '그룹에 등록된 전체 사용자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '그룹 멤버 목록을 반환합니다.',
    type: GroupMembers,
    isArray: true,
  })
  @ApiBearerAuth('access-token')
  async getAllGroupMembers(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupMembers[]> {
    return this.groupMembersService.getAllGroupMembers(groupId);
  }
}
