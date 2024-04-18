import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MembersRoleStrategy } from '../strategies/members.strategy';

@Injectable()
export class memberRolesGuard implements CanActivate {
  constructor(private strategy: MembersRoleStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId; // 인증된 사용자 가져옴
    const groupId = request.params.groupId;
    console.log('멤버스트렛지 리퀘스트', request);
    console.log('멤버스트렛지 유저아이디', userId);
    console.log('멤버스트렛지 그룹 아이디', groupId);
    return await this.strategy.validate(userId, groupId, context);
  }
}
