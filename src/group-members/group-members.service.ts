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
  // private userRepository : Repository<Users>
  async findAll() {
    return await this.groupMemberRepository.find();
  }

  async findOne(groupMemberId : number) {
    const member = await this.groupMemberRepository.findOne({ where : { groupMemberId } });

    if(member){
      throw new NotFoundException("그룹 맴버가 존재하지 않습니다.");
    }

    return member;
  }

  async groupinvite(groupId : number ,groupMemberId: number, users : Users, email : string) {
    const groups = await this.findId(groupId);
    const groupmenmber = await this.groupMemberRepository.findOne({ where : { groupMemberId } });


    if(!groups){
      throw new NotFoundException("그룹이 존재하지 않습니다.");
    }

    // if(!groupmenmber){
    //   throw new NotFoundException("그룹이 맴버가 존재하지 않습니다.");
    // }

    if(!users.userId){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }


    const randomNum = () => {
      return Math.floor(1000 + Math.random() * 9000);
    };
    
    const token = randomNum();

    
    await this.mailservice.groupsendMail(email, token, users.nickname);

    return {
      statusCode : 201,
      message : "성공적으로 초대가 완료됐습니다."
    }
  }

  async remove(groupMemberId: number) {
    const member = await this.groupMemberRepository.findOne({ where : { groupMemberId }});

    if(member){
      throw new NotFoundException("그룹 맴버가 존재하지 않습니다.");
    }

    const memberdelete = await this.groupMemberRepository.delete(groupMemberId);

    return memberdelete;
  }
  
  async accept (email : string, token : string) {

    if(email || token){
      
    }
  }

  async findId(groupId : number){
    const groups = await this.groupRepository.findOne({ where : { groupId } });

    return groups;
  }
}
