import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { RoleStrategy } from '../strategy/roles.strategy';

@Injectable()
export class RolesGuard implements CanActivate{
  
  constructor(
    private readonly strategy : RoleStrategy
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    console.log('request',request)
    console.log(request.user)
    const userId = request.user.userId

    return await this.strategy.validate(userId)
  }
}

