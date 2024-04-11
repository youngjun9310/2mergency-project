// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from 'src/users/users.service';
// import { ENV_JWT_SECRET_KEY } from 'src/const/env.keys';
// import { Users } from 'src/users/entities/user.entity';
// import {GroupMembersService} from '../group-members.service'

// @Injectable()
// export class memberRoleStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly groupMembersService: GroupMembersService,
//     private readonly configService: ConfigService, // env 파일에 있는 걸 사용하기 위한
//   ) {
//     super({ // 상속 받은 부모의 메서드를 사용할 수 있도록 가져온다.
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>(ENV_JWT_SECRET_KEY), // 복호화 
//     });
//   }

//   async validate(payload: any): Promise<member & { role: string }> { // 검증하기 : payload 
//     const groupMemberRole = await this.groupMembersService.findOne(paylad.email);
//     if (!member) {
//       throw new UnauthorizedException('유효하지 않은 사용자입니다.');
//     }

//     // isAdmin 필드를 확인하여 사용자의 역할을 결정합니다.
//     const role = member.isAdmin ? 'Admin' : 'User';

//     // 사용자 역할 정보를 포함한 객체를 반환합니다.
//     return { ...user, role };
//   }
// }