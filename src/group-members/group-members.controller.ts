import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { UsersService } from '../users/users.service';
import { memberRolesGuard } from './guard/members.guard';
import { MemberRole } from './types/groupMemberRole.type';
import { MemberRoles } from './decorator/memberRoles.decorator';
import { GroupMembers } from './entities/group-member.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InviteMemberDto } from './dto/invite_member';

@UseGuards(memberRolesGuard)
@ApiTags('groups') // API 문서에 'groups' 태그로 그룹화
@Controller('groups')
export class GroupMembersController {
  constructor(
    // private readonly scheduleMembersService: ScheduleMembersService,
    private readonly groupMembersService: GroupMembersService,
    private readonly userService: UsersService,
  ) {}

  /**
   * 그룹에 멤버 초대
   * @returns
   */

  @Post(':groupId/invite')
  @MemberRoles(MemberRole.Main)
  @HttpCode(HttpStatus.CREATED) // 요청이 성공적으로 처리되었을 때 HTTP 상태 코드 201(Created)를 반환
  @ApiOperation({ summary: '그룹에 멤버 초대' })
  @ApiResponse({ status: 201, description: '초대를 완료했습니다.' })
  async inviteUserToGroup(
    @Param('groupId') groupId: number,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    // Dto에서 이메일 주소 추출
    const { email } = inviteMemberDto;
    // 이메일 주소를 서비스 메서드에 전달하기

    await this.groupMembersService.inviteUserToGroup(groupId, email);
    //서비스 메소드를 호출 -> 사용자를 그룹에 초대하기
    return {
      message: '초대를 완료했습니다.',
    };
  }

  /**
   * 유저가 그룹 초대 수락
   * @returns
   */

  @Post(':groupId/accept/:userId')
  @HttpCode(HttpStatus.OK) //  요청이 성공적으로 처리되었을 때 HTTP 상태 코드 200(OK)을 반환
  @ApiOperation({ summary: '유저가 그룹 초대 수락' })
  @ApiResponse({ status: 200, description: '초대를 수락했습니다.' })
  async acceptGroupInvitation(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
    @Body('email') email: string,
  ): Promise<any> {
    await this.groupMembersService.acceptGroupInvitation(
      groupId,
      userId,
      email,
    );

    return {
      message: '초대를 수락했습니다.',
    };
  }

  /**
   * 그룹의 멤버로 등록
   * @returns
   */

  @Patch(':groupId/register/:userId')
  @MemberRoles(MemberRole.Main)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹의 멤버로 등록' })
  @ApiResponse({ status: 201, description: '그룹의 멤버로 등록되었습니다.' })
  async registerGroupMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    await this.groupMembersService.registerGroupMember(groupId, userId);
    // acceptGroupInvitation 메소드를 호출하여 사용자의 그룹 초대 수락 처리

    return {
      message: '그룹의 멤버로 등록되었습니다.',
    };
  }

  /* 사용자가 그룹의 멤버인지 확인 */
  @Get(':groupId/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '사용자가 그룹의 멤버인지 확인' })
  @ApiResponse({ status: 200, description: '사용자는 그룹의 멤버입니다.' })
  async isGroupMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    const isMember = await this.groupMembersService.isGroupMember(
      groupId,
      userId,
    );

    if (isMember) {
      return { message: `사용자는 ${groupId} 그룹의 멤버입니다.` };
    } else {
      return '그룹 멤버가 아닙니다.';
    }
  }

  /* 사용자와 그룹의 관련된 정보 */
  @Get(':groupId/users/:userId')
  @ApiOperation({ summary: '사용자와 그룹의 관련된 정보 조회' })
  @ApiResponse({ status: 200, description: '그룹 멤버의 상세 정보' })
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
}
