import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';

@Injectable()
export class memberRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      // 인증x
      return false;
    }

    const request = context.switchToHttp().getRequest();
    // console.log(request)
    const member = request.user;

    // `member` 객체와 `member.memberRole` 속성의 존재 확인
    if (!member) {
      return false; //없으면 접근을 거부
    }
    console.log(
      '여기가 멤버임 ㄴㅇㄹ민어러ㅣㅏㄴ어리ㅏㄴㅇ러ㅣㅁ나어리ㅏㅁㄴ얼미ㅏㄴ어린아ㅓ리낭러ㅣㄴ아ㅓㄹㅁ;ㅣㄴ아ㅓㄹ',
      member,
    );

    // 사용자가 admin 역할인지 검증하기 !
    if (member.memberRole === MemberRole.Admin) {
      return true; // 어드민이면 검증 통과 !
    }

    // 어드민이 아니면 ~, 역할 role 확인하기
    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>(
      'memberRoles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // 없으면 접근 허용
    }

    // return requiredRoles.some(role => member.memberRole.includes(role));
    return requiredRoles.some(
      (role) =>
        Array.isArray(member.memberRole) && member.memberRole.includes(role),
    );
  }
}
