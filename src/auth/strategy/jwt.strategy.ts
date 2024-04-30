import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'lodash';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ENV_JWT_SECRET_KEY } from 'src/const/env.keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token = req.cookies['authorization']; // 쿠키 이름에 따라 수정

          return token ? token.replace(/^Bearer\s/, '') : null;
        },
      ]),
      secretOrKey: configService.get<string>(ENV_JWT_SECRET_KEY),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);

    if (_.isNil(user)) {
      throw new NotFoundException('해당 사용자가 존재하지 않습니다.');
    }
    return user;
  }
}
