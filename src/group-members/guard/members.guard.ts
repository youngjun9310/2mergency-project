import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { GroupMembersService } from '../group-members.service';

@Injectable()
export class memberRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private groupMembersService: GroupMembersService, // 서비스 주입하기!
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      throw new UnauthorizedException(); // 인증 실패 -> 예외를 발생
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자 가져옴
    console.log(userId);
    const groupId = request.groups; // URL에서 그룹아이디 가져옹
    console.log('여기', groupId);
    const groupMember = request.groupMember;

    // GroupMembersService를 사용 => 해당 사용자의 그룹 멤버 정보를 조회하기!
    const groupMem = await this.groupMembersService.findByUserAndGroup(
      // GroupMembersService에 매서드 만듦
      userId,
      groupId,
    );
    console.log('그룹멤버확인이다아ㅏ', groupMem);
    if (!groupMem) {
      return false; // 조회된 멤버 정보가 없으면 접근을 거부합니다.
    }
    // console.log(
    //   '여기가 멤버임 ㄴㅇㄹ민어러ㅣㅏㄴ어리ㅏㄴㅇ러ㅣㅁ나어리ㅏㅁㄴ얼미ㅏㄴ어린아ㅓ리낭러ㅣㄴ아ㅓㄹㅁ;ㅣㄴ아ㅓㄹ',
    //   member,
    // );

    // 사용자가ㅏ 어드민인지 확인 -> 어드민이면 항상 접근 O
    if (groupMem.role === MemberRole.Admin) {
      return true; // 어드민이면 접근을 허용
    }

    // 현재 경로에 필요한 역할 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // 필요한 역할이 설정 x 라면 모든 사용자 접근을 허용.
    }

    // 사용자의 역할이 필요한 역할 중 하나인지 확인합니다.
    return requiredRoles.includes(groupMember.role);
  }
}
