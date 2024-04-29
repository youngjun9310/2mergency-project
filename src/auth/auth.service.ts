import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Invites } from './entities/invite.entity';
import { AwsService } from 'src/aws/aws.service';
import { ENV_PASSWORD_HASH_ROUNDS, ENV_ROLE_ADMIN_PASSWORD } from 'src/const/env.keys';
import _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Invites)
    private readonly invitesRepository: Repository<Invites>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}

  /*회원가입*/ //isOpen: boolean,
  async register(signUpdto, file: Express.Multer.File) {
    const { nickname, email, password, passwordConfirm, address, isOpen } = signUpdto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }
    const existingNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickname) {
      throw new ConflictException('이미 해당 닉네임으로 가입된 사용자가 있습니다!');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }

    const profileImage = await this.awsService.imageUpload(file);
    const srtToBoolean = Boolean(isOpen === 'true');
    const hashedPassword = await hash(password, this.configService.get<number>(ENV_PASSWORD_HASH_ROUNDS));
    await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage: profileImage,
      isOpen: srtToBoolean,
    });
    return { statusCode: 201, message: '회원가입에 성공하였습니다.' };
  }

  /*어드민 회원가입*/
  async adminRegister(signUpdto: any, file: Express.Multer.File) {
    const { nickname, email, password, passwordConfirm, adminPassword, address } = signUpdto;

    // 이미 가입된 이메일 체크
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }

    // 중복된 닉네임 체크
    const existingNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (existingNickname) {
      throw new ConflictException('이미 해당 닉네임으로 가입된 사용자가 있습니다!');
    }

    // 비밀번호 일치 여부 확인
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }

    // 어드민 가입 요청 키와 어드민 서비 키 비교하기
    const adminPassKey = this.configService.get<string>(ENV_ROLE_ADMIN_PASSWORD);
    if (adminPassword !== adminPassKey) {
      throw new UnauthorizedException('어드민 가입요청 키가 어드민 서버키와 일치하지 않습니다.');
    }

    // 어드민 가입 로직
    const profileImage = await this.awsService.imageUpload(file);
    const hashedPassword = await hash(password, this.configService.get<number>(ENV_ROLE_ADMIN_PASSWORD));
    await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage,
      isAdmin: true,
      CertificationStatus: true,
    });

    return { statusCode: 201, message: '어드민 회원가입에 성공하였습니다.' };
  }

  /*로그인*/
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password', 'CertificationStatus'],
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('NotExistingUser');
    }

    if (!(await compare(password, user.password))) { 
      throw new UnauthorizedException('PasswordError');
    }

    if (user.CertificationStatus === false) {
      throw new UnauthorizedException('EmailAuthError');
    }

    const payload = { email, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    return accessToken;

  }

  /** 이메일 가입초대*/
  async userInvite(email: string, gentoken: { token: number; expires: Date }) {
    const existingEmail = await this.userRepository.findOneBy({ email });

    if (existingEmail) {
      await this.invitesRepository.delete({ email });
    }

    if (existingEmail.CertificationStatus === true) {
      throw new UnauthorizedException('이미 이메일 인증이 완료되었습니다.');
    }

    const status = 'standBy';
    await this.invitesRepository.save({
      email,
      token: gentoken.token.toString(),
      expires: gentoken.expires,
      status,
    });
  }

  /** 이메일 가입수락*/
  async userAccept(email: string, token: string) {
    const existingToken = await this.invitesRepository.findOne({
      where: { email },
    });

    if (!existingToken) {
      throw new BadRequestException('인증 번호를 다시 입력해주세요.');
    }
    const present = new Date();

    if (existingToken.expires < present) {
      throw new BadRequestException('인증 번호가 만료되었습니다. 다시 요청해주세요.');
    }

    await this.invitesRepository.delete({ email });
    await this.userRepository.update({ email }, { CertificationStatus: true });

    return { statusCode: 201, message: '이메일 인증을 완료하였습니다.' };
  }
}
