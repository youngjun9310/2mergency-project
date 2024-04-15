import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RoleStrategy } from '../strategy/roles.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly strategy: RoleStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    return await this.strategy.validate(userId);
  }
}
