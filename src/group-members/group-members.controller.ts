import { Controller, Get, Param, Patch } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post()
  async (
    @Param('scheduleId') scheduleId: number,
    @Param('userId') userId: string,
  ) {
    return await this.groupMembersService.findScheduleMember(
      scheduleId,
      userId,
    );
  }

  @Patch()
  
}
