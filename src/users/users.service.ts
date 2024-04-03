import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { UpdateDto } from './dto/update.dto';
import { Invites } from './entities/invite.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Invites)
    private invitesRepository: Repository<Invites>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /*회원가입*/
  async register(nickname: string, email: string, password: string, passwordConfirm:string, address: string, profileImage: string, isOpen: boolean
    ) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }
    const existingNickname = await this.userRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new ConflictException('이미 해당 닉네임으로 가입된 사용자가 있습니다!');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }
    
    const hashedPassword = await hash(password, this.configService.get<number>('PASSWORD_HASH_ROUNDS'));
    const user = await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage,
      isOpen
    });
    
    return user;
  }

  /*어드민 회원가입*/
  async adminRegister(nickname: string, email: string, password: string, passwordConfirm:string, adminPassword: string, address: string, profileImage: string, isOpen: boolean
    ) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }
    const existingNickname = await this.userRepository.findOne({ where: { nickname } });
    if (existingNickname) {
      throw new ConflictException('이미 해당 닉네임으로 가입된 사용자가 있습니다!');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }
    
    
    const adminPassKey = this.configService.get<string>('ROLE_ADMIN_PASSWORD')

    if (adminPassword !== adminPassKey) {
      throw new UnauthorizedException('어드민 가입요청 키가 어드민 서버키와 일치하지 않습니다.');
    }
    
    const hashedPassword = await hash(password, this.configService.get<number>('PASSWORD_HASH_ROUNDS'));
    const user = await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage,
      isAdmin: true,
      isOpen
    });

    return user;
  }

  /*로그인*/
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password'],
      where: { email },
    });
    
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '12h',
    });
    console.log('accessToken', accessToken)
    // const refreshToken = this.jwtService.sign(payload, {
    //   secret: process.env.REFRESH_SECRET,
    //   expiresIn: '7d',
    // });
    return { accessToken };
  }

  /*전체 사용자 조회(어드민용)*/
  async findAllUser(){
    const user = await this.userRepository.find();
    return user;
  }

  /*사용자 조회*/
  async findUser(userId: string){
    const user = await this.userRepository.findOne({ where: { userId } });
    return user;
  }

  /*사용자 수정*/
  async userUpdate( userId: string,  updateDto: UpdateDto ) {
    const { nickname, email, password, passwordConfirm, address, profileImage, isOpen } = updateDto
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }

    const hashedPassword = await hash(password, this.configService.get<number>('PASSWORD_HASH_ROUNDS'));    

    return this.userRepository.update(userId, { nickname, email, password:hashedPassword , address, profileImage, isOpen}  );
  }

  /*사용자 삭제*/
  async userDelete(userId: string, password: string) {
    
    const user = await this.userRepository.findOne({
      select: [ 'password'],
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (!compare(password,user.password)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    
    return this.userRepository.delete(userId);
  }

  /** 이메일 가입초대*/
  async userInvite(email: string, gentoken: {token: number, expires:Date}){
    const existingEmail = await this.userRepository.findOneBy({email});
    console.log('existingEmail',existingEmail);

    if(existingEmail){
    await this.invitesRepository.delete({email})
    }

    const status = 'standBy';
    const result = await this.invitesRepository.save({
      email,
      token: (gentoken.token).toString(),
      expires: gentoken.expires,
      status
    });

    console.log('result',result)

  }

  /** 이메일 가입수락*/
  async userAccept(email: string, token: string){
    const existingToken = await this.invitesRepository.findOne({ where: { email } });

    if(!existingToken){
      throw new BadRequestException('인증 번호를 다시 입력 부탁드립니다.');
    }
    console.log('existingToken.expires',existingToken.expires);
    const present = new Date();

    if( existingToken.expires < present){
      throw new BadRequestException('인증 번호가 만료되었습니다. 다시 요청 부탁드립니다.');
    }
    
    await this.invitesRepository.delete({email});
    await this.userRepository.update({email}, {CertificationStatus: true})

    return ;
  }

   /*사용자 조회(이메일)*/
   async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}