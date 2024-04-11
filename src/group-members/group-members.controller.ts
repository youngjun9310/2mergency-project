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
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto copy';
import { InviteMemberDto } from './dto/invite_member';
import { UsersService } from '../users/users.service';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Groups } from 'src/groups/entities/group.entity';
import { memberRolesGuard} from './guard/members.guard';
import { Role } from 'src/users/types/userRole.type';
import { MemberRole } from './types/groupMemberRole.type';
import { MemberRoles } from './decorator/memberRoles.decorator';
import { ScheduleMembersService } from 'src/schedule-members/schedule-members.service';


@UseGuards(memberRolesGuard) 
@Controller('groups/:groupId')
export class GroupMembersController {
  constructor(
    private readonly scheduleMembersService: ScheduleMembersService,
    private readonly groupMembersService: GroupMembersService,
    private readonly userService: UsersService,
  ) {}

  /**
   * 그룹에 멤버 초대
   * @returns
   */

  @Post('invite')
  @MemberRoles(MemberRole.Admin)
  @HttpCode(HttpStatus.CREATED) // 요청이 성공적으로 처리되었을 때 HTTP 상태 코드 201(Created)를 반환
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

  @Post('accept/:userId')
  @HttpCode(HttpStatus.OK) //  요청이 성공적으로 처리되었을 때 HTTP 상태 코드 200(OK)을 반환
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
   * 그룹의 초대를 수락한 멤버들 조회/목록
   * @returns
   */

  @Get('acceptedMembers')
  @MemberRoles(MemberRole.Admin)
  @HttpCode(HttpStatus.OK)
  async findAcceptedMember(@Param('groupId') groupId: number) {
    const acceptedMembers =
      await this.groupMembersService.findAcceptedMember(groupId);

    // null 체크를 추가하여 `users` 객체가 없는 경우를 안전하게 처리
    return acceptedMembers
      .filter((member) => member.users) // null이 아닌 `users` 객체만 필터링
      .map((member) => ({
        userId: member.users?.userId, // 옵셔널 체이닝 ?? ->
        email: member.users?.email,
        nickname: member.users?.nickname,
      }));
  }

  @Patch('register/:userId')
  @MemberRoles(MemberRole.Admin)
  @HttpCode(HttpStatus.CREATED)
  async registerGroupMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
    @Body('email') email: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ): Promise<any> {
    await this.groupMembersService.registerGroupMember(groupId, userId);
    // acceptGroupInvitation 메소드를 호출하여 사용자의 그룹 초대 수락 처리

    return {
      message: '그룹의 멤버로 등록되었습니다.',
    };
  }

  @Get('userId')
  @HttpCode(HttpStatus.OK)
  async isGroupMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    await this.groupMembersService.isGroupMember(groupId, userId)

    return;
  }
}
