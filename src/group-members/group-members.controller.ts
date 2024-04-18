import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';

@UseGuards(JWTAuthGuard)
@ApiTags('groups')
@Controller('groups')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}
  /**
   * 그룹에 멤버 초대
   * @returns
   */
  @Post(':groupId/invite')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '그룹에 멤버 초대' })
  @ApiResponse({ status: 201, description: '초대를 완료했습니다.' })
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
  async acceptInvitation(
    @Param('groupId', ParseIntPipe) groupId: number,
    @UserInfo() users: Users,
    @Body('email') email: string,
  ): Promise<any> {
    return this.groupMembersService.acceptInvitation(
      groupId,
      users.userId,
      email,
    );
  }
}
