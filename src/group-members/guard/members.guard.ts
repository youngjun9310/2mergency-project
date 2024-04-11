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
    if (!groupMem) {
      return false; // 조회된 멤버 정보가 없으면 접근을 거부합니다.
    }
    // console.log(
    //   '여기가 멤버임 ㄴㅇㄹ민어러ㅣㅏㄴ어리ㅏㄴㅇ러ㅣㅁ나어리ㅏㅁㄴ얼미ㅏㄴ어린아ㅓ리낭러ㅣㄴ아ㅓㄹㅁ;ㅣㄴ아ㅓㄹ',
    //   member,
    // );

    // 사용자가 admin 역할인지 검증하기 !
    if (member.memberRole === MemberRole.Admin) {
      return true; // 어드민이면 검증 통과 !
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

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   // 상위 클래스의 canActivate를 호출하여 인증 여부를 확인하기!
  //   const authenticated = await super.canActivate(context);
  //   if (!authenticated) {
  //     return false; // 인증되지 않았으면 접근 거부
  //     throw new UnauthorizedException(); // // 인증 실패 시 예외를
  //   }

  //   const request = context.switchToHttp().getRequest();
  //   // console.log(request)
  //   const member = request.user;
  //   // console.log(request.user); // 사용자 객체 확인

  //   // `member` 객체와 `member.memberRole` 속성의 존재 확인
  //   if (!member) {
  //     return false; // 사용자 객체가 없으면 접근 거부
  //   }
  //   console.log('멤버롤 확인!!', member.memberRole); // 사용자 역할 로깅

  //   // 사용자가 admin 역할인지 검증하기 !
  //   if (member.memberRole === MemberRole.Admin) {
  //     return true; // 어드민이면 검증 통과 !
  //   }

  //   // 어드민이 아니면 ~, 역할 role 확인하기
  //   const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(
  //     'memberRoles',
  //     [context.getHandler(), context.getClass()],
  //   );

  //   console.log('필요한 역할 확인:', requiredRoles); // 필요한 롤 확인

  //   if (!requiredRoles) {
  //     return true; // 필요한 역할이 설정되지 않았으면 접근 허용
  //   }

  //   // return requiredRoles.some(role => member.memberRole.includes(role));
  //   return requiredRoles.some((memberRole) => member.memberRole === memberRole);
  // }
}
