import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMembers)
    private GroupMemberRepository: Repository<GroupMembers>,
  ) {}

  // 그룹 멤버 초대하기

  // 그룹 초대 수락하기
}
