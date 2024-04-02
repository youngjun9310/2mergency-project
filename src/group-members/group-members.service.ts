import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupMembersService {
 constructor(
  @InjectRepository(GroupMembers)
  private GroupMember:Repository<GroupMembers>
 )
}
