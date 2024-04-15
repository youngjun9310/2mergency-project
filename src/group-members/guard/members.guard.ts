import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MembersRoleStrategy } from '../strategies/members.strategy';

@Injectable()
export class memberRolesGuard implements CanActivate {
  constructor(private strategy: MembersRoleStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자 가져옴
    const groupId = request.groups; // URL에서 그룹아이디 가져옹
    return await this.strategy.validate(userId, groupId, context);
  }
}
