import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from './entities/group-member.entity';
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMembers)
    private groupMemberRepository: Repository<GroupMembers>,
    @InjectRepository(Groups) private groupRepository: Repository<Groups>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * 그룹에 멤버 초대
   * @returns
   */

  async inviteUserToGroup(groupId: number, email: string): Promise<any> {
    // 그룹 존재 여부 확인
    console.log(groupId);
    const group = await this.groupRepository.findOne({
      where: { groupId },
    });
    if (!group) {
      throw new NotFoundException(`그룹이 존재하지 않습니다.`);
    }

    // '사용자'가 있는지 확인하기
    const user = await this.usersService.findByEmail(email);
    console.log('유저임', user);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    // 사용자가 이미 그룹 멤버인지 여부 확인
    const member = await this.groupMemberRepository.findOne({
      where: {
        userId: user.userId,
        groupId: group.groupId,
      },
    });

    if (member) {
      throw new BadRequestException('유저는 이미 그룹에 초대되었습니다.');
    }

    // 사용자를 바로 그룹 멤버로 추가X => 그냥 초대 상태만 설정
    const memberInvite = this.groupMemberRepository.create({
      userId: user.userId,
      groupId: group.groupId,
      isInvited: true,
      isVailed: false, // 초대 수락 여부는 false로 초기 설정
    });
    console.log('멤버초대', memberInvite);
    await this.groupMemberRepository.save(memberInvite);

    return { success: true, message: '초대가 발송되었습니다.' };
  }

  /**
   * 유저가 그룹 초대 수락
   * @returns
   */

  async acceptGroupInvitation(
    groupId: number,
    userId: number,
    email: string,
  ): Promise<any> {
    const group = await this.groupRepository.findOne({
      where: { groupId },
    });
    if (!group) {
      throw new NotFoundException(`그룹이 존재하지 않습니다.`);
    }

    // '사용자'가 있는지 확인하기
    const user = await this.usersService.findByEmail(email);
    console.log('유저임', user);
    if (!user) {
      throw new NotFoundException(
        `이메일 ${email}에 해당하는 유저가 존재하지 않습니다.`,
      );
    }

    // 사용자 ID가 실제로 제공된 userId와 일치하는지 확인
    if (user.userId !== userId) {
      throw new NotFoundException(`userId가 유효하지 않습니다.`);
    }

    // 그룹 멤버 조회
    const member = await this.groupMemberRepository.findOne({
      where: {
        userId: user.userId,
        groupId: groupId,
      },
      relations: ['users', 'groups'],
    });

    // 해당 그룹에 멤버(초대?)가 존재하는지 확인
    if (!member) {
      throw new NotFoundException('해당 그룹의 초대가 존재하지 않습니다.');
    }

    // 이미 초대가 된 상태?인지 확인
    if (member.isVailed) {
      throw new BadRequestException(
        '유저는 이미 그룹에 초대되었습니다. 초대를 수락해주세요.',
      );
    }

    // 초대 상태가 맞는지 확인
    if (!member.isInvited) {
      throw new BadRequestException('유효하지 않은 초대입니다.');
    }

    // 그룹 초대를 수락 상태로 변경하고 멤버 업데이트 !
    member.isVailed = true; // 초대 수락 상태로 변경
    await this.groupMemberRepository.save(member); // 수락 상태 저장하기

    return { success: true, message: '초대를 수락했습니다.' };
  }

  /**
   * 그룹 초대 수락 멤버 조회
   * @returns
   */

  async findAcceptedMember(groupId: number): Promise<GroupMembers[]> {
    return await this.groupMemberRepository.find({
      where: {
        groupId: groupId,
        isVailed: true,
      },
      relations: ['users'],
    });
  }

}
