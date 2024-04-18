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
    private groupMembersRepository: Repository<GroupMembers>,
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
    const existingInvite = await this.groupMembersRepository.findOne({
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

    const newInvite = this.groupMembersRepository.create({
      users: userToInvite, // users와 groups 필드에 엔티티의 인스턴스를 직접 할당하기 // { userId },
      groups: group, // { groupId },
      isInvited: true,
      isVailed: false, // 초대 수락 여부는 false로 초기 설정
    });
    await this.groupMembersRepository.save(newInvite);

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
    if (!user) {
      throw new NotFoundException(`${user.userId}유저가가 존재하지 않습니다.`);
    }

    // 사용자의 초대 상태 확인
    const invite = await this.groupMembersRepository.findOne({
      where: {
        users: { userId: user.userId },
        groups: { groupId },
        isInvited: true, // 초대가 발송된 상태인지 확인
        isVailed: true,
      },
    });

    if (!invite) {
      throw new NotFoundException(
        `해당 유저${user.userId}는 초대받지 않았습니다.`,
      );
    }

    // 초대 수락 처리
    invite.isVailed = true; // 초대 수락 여부를 true로 설정
    await this.groupMembersRepository.save(invite);

    return {
      success: true,
      message: `${user.userId}님이 초대를 수락, ${groupId} 그룹 멤버로 등록되었습니다.`,
    };
  }
}
