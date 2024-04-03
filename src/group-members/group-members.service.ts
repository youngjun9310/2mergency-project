import { Injectable, NotFoundException } from '@nestjs/common';
import { InvitememberDto } from './dto/invite_member';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(@InjectRepository(GroupMembers) private groupMemberRepository : Repository<GroupMembers>,
  @InjectRepository(Groups) private groupRepository : Repository<Groups>,
 
  private readonly mailservice : MailService ){}
 
}
