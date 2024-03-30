import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') groupId: number) {
    return this.groupsService.findOne(groupId);
  }

  @Patch(':id')
  update(@Param('id') groupId: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(groupId, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') groupId: number) {
    return this.groupsService.remove(groupId);
  }
}
