import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UnauthorizedException,
  Render,
  Res,
} from "@nestjs/common";
import { GroupMembersService } from "./group-members.service";
import { MemberRole } from "./types/groupMemberRole.type";
import { MemberRoles } from "./decorator/memberRoles.decorator";
import { GroupMembers } from "./entities/group-member.entity";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JWTAuthGuard } from "src/auth/guard/jwt.guard";
import { memberRolesGuard } from "./guard/members.guard";
import { UserInfo } from "src/auth/decorator/userInfo.decorator";
import { Users } from "src/users/entities/user.entity";
import { InviteMemberDto } from "./dto/invite-member.dto";
import { Response } from "express";
import { UsersService } from "src/users/users.service";

@UseGuards(JWTAuthGuard)
@ApiTags("GroupMember")
@Controller("groups")
export class GroupMembersController {
  constructor(
    private readonly groupMembersService: GroupMembersService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 그룹에 멤버 초대
   */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Post(":groupId/invite")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "그룹에 멤버 초대 API", description: "그룹에 멤버 초대 성공" })
  @ApiResponse({ status: 201, description: "성공적으로 초대를 완료했습니다." })
  @ApiBearerAuth("access-token")
  async inviteUserToGroup(
    @Param("groupId") groupId: number,
    @UserInfo() users: Users,
    @Body() inviteMemberDto: InviteMemberDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email } = inviteMemberDto;

    try {
      await this.groupMembersService.inviteUserToGroup(groupId, users.userId, email);
      res.status(201).send(`
      <script>
        alert("${inviteMemberDto.email}으로 초대가 발송되었습니다.");
        window.location.href = '/groups/groups_h/groupAll';
      </script>
    `);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg)
        res.status(400).send(`
            <script>
              alert(\`${error.message}\`);
            </script>
          `);
    }
  }

  /**
   * 유저가 그룹 초대 수락
   * @returns
   */

  @Post(":groupId/accept")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "사용자가 그룹 초대를 수락 API", description: "그룹 초대 수락 성공" })
  @ApiResponse({ status: 200, description: "초대를 수락했습니다." })
  @ApiBearerAuth("access-token")
  async acceptInvitation(
    @Param("groupId", ParseIntPipe) groupId: number,
    @UserInfo() currentUser: Users,
    @Body("email") email: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      await this.usersService.findByEmail(email);

      if (currentUser.email !== email) {
        throw new UnauthorizedException(
          `${email} 주소가 현재 로그인한 사용자의 이메일${currentUser.email}과 일치하지 않습니다.`,
        );
      }

      const result = await this.groupMembersService.acceptInvitation(groupId, currentUser.userId, email);

      if (result) {
        res.status(201).send(`
          <script>
           alert(\`${result.message}\`);
            window.location.href = '/groups/groups_h/groupAll';
          </script>
        `);
      } else {
        res.status(201).send(`
          <script>
            alert(\`${result.message}\`);
            window.location.href = '/groups/groups_h/groupAll';
          </script>
        `);
      }
    } catch (error) {
      res.status(400).send(`
        <script>
          alert(\`${error.message}\`);
          window.location.href = '/groups/groups_h/groupAll';
        </script>
      `);
    }
  }

  /**
   * 특정 사용자의 그룹 멤버 정보 조회
   * */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(":groupId/users/:userId")
  @ApiOperation({ summary: "사용자와 그룹의 관련된 정보 조회 API", description: "사용자의 그룹 멤버 정보 조회 성공" })
  @ApiResponse({ status: 200, description: "성공적으로 그룹 멤버의 상세 정보를 조회하였습니다." })
  @ApiBearerAuth("access-token")
  async findByUserAndGroup(@Param("userId") userId: number, @Param("groupId") groupId: number): Promise<GroupMembers> {
    return await this.groupMembersService.findByUserAndGroup(userId, groupId);
  }

  /**
   * 해당 그룹의 멤버 전체 조회
   * */

  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get(":groupId/members")
  @ApiOperation({
    summary: "그룹에 등록된 전체 사용자 목록 조회 API",
    description: "그룹에 등록된 전체 사용자 목록 조회 성공",
  })
  @ApiResponse({
    status: 200,
    description: "성공적으로 그룹 멤버 전체 조회를 완료 하였습니다.",
    type: GroupMembers,
    isArray: true,
  })
  @ApiBearerAuth("access-token")
  async getAllGroupMembers(@Param("groupId", ParseIntPipe) groupId: number): Promise<GroupMembers[]> {
    return this.groupMembersService.getAllGroupMembers(groupId);
  }

  /** hbs 양식 */
  // 그룹 맴버 초대
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get("/:groupId/invite/group-members_h/groupInvite")
  @Render("groupInvite")
  async groupinvite(@Param("groupId") groupId: number, @UserInfo() users: Users) {
    return {
      groupId: groupId,
      users: users,
    };
  }

  // 그룹 맴버 수락
  @Get("/:groupId/accept/group-members_h/groupAccept")
  @Render("groupAccept")
  async groupaccept(@Param("groupId") groupId: number, @UserInfo() users: Users) {
    return {
      groupId: groupId,
      users: users,
    };
  }
}
