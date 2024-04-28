import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Repository } from 'typeorm';
import { Groups } from './entities/group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { Users } from 'src/users/entities/user.entity';
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groups) private groupRepository: Repository<Groups>,
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  /** *
   * 그룹 생성 *
   **/

  async createGroup(createGroupDto: CreateGroupDto, userId: number, users: Users) {
    const { title, content, category } = createGroupDto;

    const groupCreate = await this.groupRepository.save({
      title,
      content,
      category,
    });

    if (users.CertificationStatus === false) {
      throw new UnauthorizedException('EmailAuthError');
    }
    try {
      // 고유한 닉네임 생성 -> 사용자 ID와 현재 시간을 결합
      // const uniqueNickname = `user_${userId}_${user.nickname}`;

      await this.groupMembersRepository.save({
        groupId: groupCreate.groupId,
        userId,
        role: MemberRole.Main,
        isVailed: true,
        isInvited: true,
      });
    } catch (error) {
      console.error('Error', error);
    }
    return groupCreate;
  }

  /** *
   * 그룹 모든 목록 조회 *
   **/

  async findAllGroups() {
    return await this.groupRepository.find();
  }

  /** *
   * 그룹 상세 목록 조회 *
   **/

  async findOneGroup(groupId: number): Promise<Groups | undefined> {
    const groups = await this.groupRepository.findOne({ where: { groupId } });

    if (!groups) {
      throw new NotFoundException('그룹이 존재하지 않습니다.');
    }

    return groups;
  }

  /** *
   * 그룹 모든 수정 *
   **/

  async updateGroup(groupId: number, updateGroupDto: UpdateGroupDto) {
    const { title, content, category, isPublic } = updateGroupDto;
    const groups = await this.groupRepository.findOne({ where: { groupId } });

    if (!groups) {
      throw new NotFoundException('해당 그룹이 존재하지 않습니다.');
    }

    await this.groupRepository.update(groupId, {
      title,
      content,
      category,
      isPublic,
    });

    return { statusCode: 201, message: '성공적으로 그룹을 수정하였습니다.' };
  }

  /** *
   * 그룹 삭제 *
   **/

  async deleteGroup(groupId: number) {
    const groups = await this.groupRepository.findOne({ where: { groupId } });

    if (!groups) {
      throw new NotFoundException('그룹이 존재하지 않습니다.');
    }

    await this.groupRepository.delete(groupId);

    return { statusCode: 201, message: '성공적으로 그룹을 삭제하였습니다.' };
  }
}
