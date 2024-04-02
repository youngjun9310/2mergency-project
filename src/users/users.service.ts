import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import * as _ from 'lodash';
import { ConfigService } from '@nestjs/config';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(nickname: string, email: string, password: string, passwordConfirm:string, adminPassword: string, address: string, profileImage: string, isAdmin: boolean, isOpen: boolean
    ) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException('비밀번호가 체크비밀번호와 일치하지 않습니다.');
    }
    
    const adminPassKey = this.configService.get<string>('ROLE_ADMIN_PASSWORD')
    
    if(adminPassword){

      if (adminPassword !== adminPassKey) {
        throw new UnauthorizedException('어드민 가입요청 키가 어드민 서버키와 일치하지 않습니다.');
      }
      isAdmin = true;
    }
    
    const hashedPassword = await hash(password, this.configService.get<number>('PASSWORD_HASH_ROUNDS'));
    const user = await this.userRepository.save({
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage,
      isAdmin,
      isOpen
    });
    return user;
  }

  async login(email: string, password: string) {
    console.log('email',email)
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password'],
      where: { email },
    });
    console.log('user',user)
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.userId };
    console.log('payload',payload)
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

  async findAllUser(){
    const user = await this.userRepository.find();
    return user;
  }

  async findUser(userId: string){
    const user = await this.userRepository.findOne({ where: { userId } });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

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
}