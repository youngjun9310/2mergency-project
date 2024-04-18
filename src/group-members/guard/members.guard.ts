import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MembersRoleStrategy } from '../strategies/members.strategy';

@Injectable()
export class memberRolesGuard implements CanActivate {
  constructor(private strategy: MembersRoleStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('멤버가드 컨텍스트', context);
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자 가져옴
    const groupId = request.user.groupId; // URL에서 그룹아이디 가져옹
    console.log('멤버가드', request);
    console.log('멤버가드 userId', userId);
    console.log('멤버가드 그룹 groupId', groupId);
    return await this.strategy.validate(userId, groupId, context);
  }
}
