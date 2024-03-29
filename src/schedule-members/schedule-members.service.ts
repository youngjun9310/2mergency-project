import { Injectable } from '@nestjs/common';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';

@Injectable()
export class ScheduleMembersService {
  create(createScheduleMemberDto: CreateScheduleMemberDto) {
    return 'This action adds a new scheduleMember';
  }

  findAll() {
    return `This action returns all scheduleMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleMember`;
  }

  update(id: number, updateScheduleMemberDto: UpdateScheduleMemberDto) {
    return `This action updates a #${id} scheduleMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleMember`;
  }
}
