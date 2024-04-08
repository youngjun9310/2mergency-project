import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { Groups } from 'src/groups/entities/group.entity';

@Injectable()
export class GroupMembersService {
  constructor(@InjectRepository(GroupMembers) private groupMemberRepository : Repository<GroupMembers>,
  @InjectRepository(Groups) private groupRepository : Repository<Groups>,
 
  private readonly mailservice : MailService ){}
 
}
