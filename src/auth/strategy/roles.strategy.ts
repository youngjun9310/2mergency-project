import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoleStrategy {
  constructor(private readonly userService: UsersService) {}

  async validate(userId: number) {
    const user = await this.userService.findUser(userId);

    if (user.isAdmin) {
      return true;
    }
    return false;
  }
}
