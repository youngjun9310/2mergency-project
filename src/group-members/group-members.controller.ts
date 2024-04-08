import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvitememberDto } from './dto/invite_member';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';


@Controller('groups/:groupId')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

}
