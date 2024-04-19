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
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMembers)
    private groupMemberRepository: Repository<GroupMembers>,
    @InjectRepository(Groups) private groupRepository: Repository<Groups>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private usersService: UsersService,
  ) {}

  /**
   * 그룹에 멤버 초대
   */

  async inviteUserToGroup(groupId: number, userId: number, email: string) {
    // 그룹 존재 여부 확인
    const group = await this.groupRepository.findOne({
      where: { groupId },
    });
    if (!group) {
      throw new NotFoundException(`${groupId}그룹이 존재하지 않습니다.`);
    }

    // '사용자'가 있는지 확인하기
    const userToInvite = await this.usersService.findByEmail(email);
    if (!userToInvite) {
      throw new NotFoundException(`${email}유저가 존재하지 않습니다.`);
    }

    // 사용자에게 보낸 초대가 있는지 확인
    const existingInvite = await this.groupMemberRepository.findOne({
      where: {
        users: { userId: userToInvite.userId },
        groups: { groupId },
      },
    });

    if (existingInvite) {
      if (existingInvite.isVailed) {
        throw new BadRequestException(
          `${userToInvite.userId}유저는 이미 ${groupId}그룹의 멤버입니다.`,
        );
      } else {
        throw new BadRequestException(
          `${userToInvite.userId}유저는 이미 ${groupId}그룹의 초대가 발송되었습니다.`,
        );
      }
    }

    const newInvite = this.groupMemberRepository.create({
      users: userToInvite, // users와 groups 필드에 엔티티의 인스턴스를 직접 할당하기 // { userId },
      groups: group, // { groupId },
      isInvited: true,
      isVailed: false, // 초대 수락 여부는 false로 초기 설정
    });
    await this.groupMemberRepository.save(newInvite);

    return {
      success: true,
      message: `${userToInvite.userId}유저에게 초대가 발송되었습니다.`,
    };
  }

  /**
   * 유저가 그룹 초대 수락
   */

  async acceptInvitation(
    groupId: number,
    userId: number,
    email: string,
  ): Promise<any> {
    // 그룹 존재 여부 확인
    const group = await this.groupRepository.findOne({ where: { groupId } });
    if (!group) {
      throw new NotFoundException(`${groupId}그룹이 존재하지 않습니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userId !== userId) {
      throw new NotFoundException(
        `${user.userId}유저가가 존재하지 않거나 일치하지 않습니다.`,
      );
    }

    // 사용자의 초대 상태 확인
    const invite = await this.groupMemberRepository.findOne({
      where: {
        userId: user.userId, // 직접적인 필드 사용으로 변경
        groupId: groupId,
      },
    });
    console.log('그룹멤버 초대: 이름을 바꿔서 구분해보자', invite);

    if (!invite) {
      throw new NotFoundException(
        `해당 ${user.userId} 유저는 초대받지 않았습니다.`,
      );
    }

    // 이미 초대를 수락한 경우
    if (invite.isVailed) {
      return {
        success: false,
        message: `${user.userId} 유저는 이미 초대를 수락한 사용자입니다.`,
      };
    }

    // 초대 수락 처리
    invite.isVailed = true; // 초대 수락 여부를 true로 설정
    await this.groupMemberRepository.save(invite);

    return {
      success: true,
      message: `${user.userId}님이 초대를 수락, ${groupId} 그룹 멤버로 등록되었습니다.`,
    };
  }

  /**
   * 사용자가 그룹의 멤버인지 확인
   **/
  async isGroupMember(groupId: number, userId: number): Promise<boolean> {
    console.log(`확인하기 : groupId: ${groupId}, userId: ${userId}`);
    const member = await this.groupMemberRepository.findOne({
      where: { groupId: groupId, userId: userId },
    });
    return !!member;
    // !!member: 논리 NOT 연산자(!)를 두 번 사용하여,
    //   // member 변수의 "진리성(truthiness)"을 boolean 값으로 강제 변환
    //   // member가 존재하면 (null 또는 undefined가 아니면),
    //   // true를 반환하고, 그렇지 않으면 false를 반환
  }

  /**
   * 특정 사용자의 그룹 멤버 정보 조회
   */
  async findByUserAndGroup(
    userId: number,
    groupId: number,
  ): Promise<GroupMembers | undefined> {
    return await this.groupMemberRepository.findOne({
      where: {
        users: { userId },
        groups: { groupId },
      },
    });
  }

  /**
   * 해당 그룹의 멤버 전체 조회
   * */
  async getAllGroupMembers(
    groupId: number,
    // userId: number,
  ): Promise<GroupMembers[]> {
    const members = await this.groupMemberRepository.find({
      where: { groups: { groupId } },
      relations: ['users'],
    });
    if (!members.length) {
      throw new NotFoundException(
        `그룹 ID ${groupId}에 해당하는 멤버가 없습니다.`,
      );
    }

    return members;
  }

  /**
   * 그룹과 사용자의 존재 및 멤버 여부를 확인
   */
  async isGroupMemberDetailed(
    groupId: number,
    userId: number,
  ): Promise<GroupMembers | null> {
    return this.groupMemberRepository.findOne({
      where: {
        groups: { groupId },
        users: { userId },
      },
      relations: ['groups', 'users'],
    });
  }
}
