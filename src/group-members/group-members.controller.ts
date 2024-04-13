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
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { memberRolesGuard } from './guard/members.guard';
import { MemberRole } from './types/groupMemberRole.type';
import { MemberRoles } from './decorator/memberRoles.decorator';
import { GroupMembers } from './entities/group-member.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { emit } from 'process';

@UseGuards(memberRolesGuard)
@ApiTags('groups')
@Controller('groups')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  /**
   * 그룹에 멤버 초대
   * @returns
   */

  @Post(':groupId/invite')
  @MemberRoles(MemberRole.Main)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹에 멤버 초대' })
  @ApiResponse({ status: 201, description: '초대를 완료했습니다.' })
  async inviteUserToGroup(
    @Param('groupId') groupId: number,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    const { email } = inviteMemberDto;

    await this.groupMembersService.inviteUserToGroup(groupId, email);
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
  async acceptInvitation(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body('email') email: string,
  ): Promise<any> {
    return this.groupMembersService.acceptInvitation(groupId, email);
  }

  /**
   * 그룹의 멤버로 등록
   * @returns
   */

  @Patch(':groupId/register') //
  @MemberRoles(MemberRole.Main)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹의 멤버로 등록' })
  @ApiResponse({ status: 201, description: '그룹의 멤버로 등록되었습니다.' })
  async registerGroupMember(
    @Param('groupId') groupId: number,
    @Body('email') email: string,
  ): Promise<any> {
    if (!email) {
      throw new BadRequestException('이메일 주소가 제공되지 않았습니다.');
    }

    return await this.groupMembersService.addGroupMember(groupId, email);
  }

  /* 사용자가 그룹의 멤버인지 확인 */
  @Get(':groupId/members/:userId')
  @ApiOperation({ summary: '사용자가 그룹의 멤버인지 확인' })
  @ApiResponse({ status: 200, description: '사용자는 그룹의 멤버입니다.' })
  @ApiResponse({
    status: 404,
    description: '사용자 또는 그룹이 존재하지 않습니다.',
  })
  async isGroupMember(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    const groupExists =
      await this.groupMembersService.checkGroupExists(groupId);
    if (!groupExists) {
      return {
        message: `그룹 ID ${groupId}에 해당하는 그룹이 존재하지 않습니다.`,
        statusCode: 404,
      };
    }

    const userExists = await this.groupMembersService.checkUserExists(userId);
    if (!userExists) {
      return {
        message: `사용자 ID ${userId}에 해당하는 사용자가 존재하지 않습니다.`,
        statusCode: 404,
      };
    }

    const isMember = await this.groupMembersService.isGroupMember(
      groupId,
      userId,
    );
    if (isMember) {
      return { message: `사용자는 그룹 ${groupId}의 멤버입니다.` };
    } else {
      return { message: '그룹 멤버가 아닙니다.', statusCode: 404 };
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

  /* 그룹에 가입된 사용자 전체 조회 */
  @Get(':groupId/members')
  @ApiOperation({ summary: '그룹에 등록된 전체 사용자 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '그룹 멤버 목록을 반환합니다.',
    type: GroupMembers,
    isArray: true,
  })
  async getAllGroupMembers(
    @Param('groupId', ParseIntPipe) groupId: number,
  ): Promise<GroupMembers[]> {
    return this.groupMembersService.getAllGroupMembers(groupId);
  }
}
