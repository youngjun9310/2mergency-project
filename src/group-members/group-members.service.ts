import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMembers } from "./entities/group-member.entity";
import { Repository } from "typeorm";
import { Groups } from "src/groups/entities/group.entity";
import { UsersService } from "src/users/users.service";
import { Users } from "src/users/entities/user.entity";

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
      throw new NotFoundException(`${group.title} 그룹이 존재하지 않습니다.`);
    }

    // '사용자'가 있는지 확인하기
    const userToInvite = await this.usersService.findByEmail(email);
    if (!userToInvite) {
      throw new NotFoundException(`${email} 유저가 존재하지 않습니다.`);
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
        throw new BadRequestException(`${userToInvite.nickname} 님은(는) 이미 ${group.title} 그룹의 멤버입니다.`);
      } else {
        throw new BadRequestException(`${userToInvite.nickname} 님께 이미 ${group.title} 그룹 초대가 발송되었습니다.`);
      }
    }

    const newInvite = this.groupMemberRepository.create({
      users: userToInvite,
      groups: group,
      isInvited: true,
      isVailed: false, // 초대 수락 여부는 false로 초기 설정
    });
    await this.groupMemberRepository.save(newInvite);

    return {
      statusCode: 200,
      message: `${userToInvite.nickname}님께 초대가 발송되었습니다.`,
    };
  }

  /**
   * 유저가 그룹 초대 수락
   */

  async acceptInvitation(groupId: number, userId: number, email: string): Promise<any> {
    // 그룹 존재 여부 확인
    const group = await this.groupRepository.findOne({ where: { groupId } });
    if (!group) {
      throw new NotFoundException(`존재하지 않는 그룹입니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userId !== userId) {
      throw new NotFoundException(`존재하지 않거나 일치하지 않는 이메일입니다.`);
    }

    // 사용자의 초대 상태 확인
    const invite = await this.groupMemberRepository.findOne({
      where: {
        userId: user.userId, // 직접적인 필드 사용으로 변경
        groupId: groupId,
      },
    });

    if (!invite) {
      throw new NotFoundException(`해당 ${user.nickname} 유저는 초대받지 않았습니다.`);
    }

    // 이미 초대를 수락한 경우
    if (invite.isVailed) {
      return {
        success: false,
        message: `${user.nickname} 유저는 이미 초대를 수락한 사용자입니다.`,
      };
    }

    // 초대 수락 처리
    invite.isVailed = true; // 초대 수락 여부를 true로 설정
    await this.groupMemberRepository.save(invite);

    return {
      success: true,
      message: `${user.nickname}님이 ${group.title} 그룹 멤버로 등록되었습니다.`,
    };
  }

  /**
   * 사용자가 그룹의 멤버인지 확인
   **/
  async isGroupMember(groupId: number, userId: number): Promise<boolean> {
    const member = await this.groupMemberRepository.findOne({
      where: { groupId: groupId, userId: userId },
    });
    return !!member;
  }

  /**
   * 특정 사용자의 그룹 멤버 정보 조회
   */
  async findByUserAndGroup(userId: number, groupId: number): Promise<GroupMembers | undefined> {
    const findGroupMember = await this.groupMemberRepository.findOne({
      where: {
        userId,
        groupId,
      },
    });
    if (!findGroupMember) {
      throw new NotFoundException(`멤버 정보를 찾을 수 없습니다.`);
    }

    return findGroupMember;
  }

  /**
   * 해당 그룹의 멤버 전체 조회
   * */
  async getAllGroupMembers(groupId: number): Promise<GroupMembers[]> {
    const findGroup = await this.groupRepository.findOne({
      where: { groupId },
    });

    if (!findGroup) {
      throw new NotFoundException("존재하지 않는 그룹입니다.");
    }

    const members = await this.groupMemberRepository.find({
      where: { groupId },
      relations: ["users"],
    });
    if (!members) {
      throw new NotFoundException(` ${findGroup.title} 그룹에 해당하는 멤버가 없습니다.`);
    }

    return members;
  }

  /**
   * 그룹과 사용자의 존재 및 멤버 여부를 확인
   */
  async isGroupMemberDetailed(groupId: number, userId: number): Promise<GroupMembers | null> {
    return this.groupMemberRepository.findOne({
      where: {
        groups: { groupId },
        users: { userId },
      },
      relations: ["groups", "users"],
    });
  }
}
