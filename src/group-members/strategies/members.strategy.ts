import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MemberRole } from '../types/groupMemberRole.type';
import { MemberRoles } from '../decorator/memberRoles.decorator';
import { GroupMembers } from '../entities/group-member.entity';

@Injectable()
export class MembersRoleStrategy {
  constructor(
    private reflector: Reflector,
    @InjectRepository(GroupMembers)
    private readonly groupMemberRepository: Repository<GroupMembers>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async validate(userId: number, groupId: number, context: ExecutionContext) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    console.log('멤버스트렛지 유저', user);

    if (!user) {
      return false; // 유저가 데이터베이스에 없는 경우
    }

    if (user.isAdmin === true) {
      return true;
    }

    const groupMem = await this.groupMemberRepository.findOne({
      where: { users: { userId }, groups: { groupId } },
    });

    console.log('멤버스트릿지 groupMem', groupMem);
    if (!groupMem) {
      return false; // 조회된 멤버 정보가 없으면 접근을 거부합니다.
    }

    // 현재 경로에 필요한 역할 가져오기
    const requiredRole = this.reflector.get<MemberRole[]>(
      MemberRoles,
      context.getHandler(),
    );
    console.log('멤버스트릿지 requiredRole', requiredRole);
    if (!requiredRole) {
      return true; // 필요한 역할이 설정 x 라면 모든 사용자 접근을 허용.
    }

    const memberRole: MemberRole = groupMem.role;
    // 사용자의 역할이 필요한 역할 중 하나인지 확인합니다.
    console.log('멤버스트릿지 memberRole', memberRole);

    return requiredRole.includes(memberRole);
  }
}
