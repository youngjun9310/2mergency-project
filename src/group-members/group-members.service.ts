import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupMemberDto } from './dto/create-group-member.dto';
import { UpdateGroupMemberDto } from './dto/update-group-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupsService } from 'src/groups/groups.service';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(@InjectRepository(GroupMembers) private groupMemberRepository : Repository<GroupMembers>,
  ){}
  // private userRepository : Repository<Users>
  // @InjectRepository(Groups) private groupRepository : Repository<Groups>
  findAll() {
    
    return `This action returns all groupMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} groupMember`;
  }

  async groupinvite(groupMemberId: number, user : Users, userId : bigint, updateGroupMemberDto: UpdateGroupMemberDto) {
    // const groups = await this.findId(groupMemberId);
    // const users = this.userRepository.findOne({ where : { userId } });

    // if(!users){
    //   throw new NotFoundException("유저가 존재하지 않습니다.");
    // }


    const invite = await this.groupMemberRepository.update(groupMemberId, updateGroupMemberDto);
    return invite;
  }

  remove(id: number) {
    return `This action removes a #${id} groupMember`;
  }

  // async findId(groupId : number){
  //   const groups = await this.groupRepository.findOne({ where : { groupId } });

  //   if(!groups){
  //     throw new NotFoundException("그룹이 존재하지 않습니다.");
  //   }

  //   return groups;
  // }
}
