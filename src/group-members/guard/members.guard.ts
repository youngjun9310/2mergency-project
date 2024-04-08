import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';


@Injectable()
export class memberRolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    console.log("확인", context)
    if (!authenticated) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<MemberRole[]>('memberRoles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const member  = context.switchToHttp().getRequest();
    console.log("여기",member)
    return requiredRoles.some((memberRole) => member.memberRole === memberRole);
  }
}
