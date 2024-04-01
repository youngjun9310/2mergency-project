import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';


@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}


  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 생성 API', description: '그룹을 생성한다.' })
  @ApiCreatedResponse({ description: '그룹 생성', type: CreateGroupDto })
  @Post()
  async create(@Body() createGroupDto: CreateGroupDto, @UserInfo() users : Users) {
    return await this.groupsService.create(createGroupDto);
  }


  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 모든 목록 조회 API', description: '그룹의 모든 목록을 조회' })
  @ApiCreatedResponse({ description: '그룹 모든 목록 조회' })
  @Get()
  async findAll() {
    return await this.groupsService.findAll();
  }


  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 상세 조회 API', description: '그룹의 상세 목록을 조회' })
  @ApiCreatedResponse({ description: '그룹 상세 조회' })
  @Get(':id')
  async findOne(@Param('id') groupId: number) {
    return await this.groupsService.findOne(groupId);
  }


  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 업데이트 API', description: '그룹의 목록을 수정합니다.' })
  @ApiCreatedResponse({ description: '그룹 수정' })
  @Patch(':id')
  async update(@Param('id') groupId: number, @Body() updateGroupDto: UpdateGroupDto) {
    return await this.groupsService.update(groupId, updateGroupDto);
  }


  @ApiTags('groups')
  @ApiOperation({ summary: '그룹 삭제 API', description: '그룹을 삭제합니다.' })
  @ApiCreatedResponse({ description: '그룹 삭제' })
  @Delete(':id')
  async remove(@Param('id') groupId: number) {
    return await this.groupsService.remove(groupId);
  }
}
