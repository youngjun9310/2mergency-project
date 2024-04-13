import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateDto } from './dto/update.dto';
import { AwsService } from 'src/aws/aws.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}
  /*전체 사용자 조회(어드민용)*/
  async findAllUser() {
    const user = await this.userRepository.find();
    return user;
  }
  /*사용자 조회*/
  async findUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });
    return user;
  }
  /*사용자 수정*/
  async userUpdate(
    userId: number,
    updateDto: UpdateDto,
    file: Express.Multer.File,
  ) {
    const { nickname, email, password, passwordConfirm, address, isOpen } =
      updateDto;
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (password !== passwordConfirm) {
      throw new UnauthorizedException(
        '비밀번호가 체크비밀번호와 일치하지 않습니다.',
      );
    }
    const profileImage = await this.awsService.imageUpload(file);
    const srtToBoolean = Boolean(isOpen === 'true');
    const hashedPassword = await hash(
      password,
      this.configService.get<number>('PASSWORD_HASH_ROUNDS'),
    );
    return this.userRepository.update(userId, {
      nickname,
      email,
      password: hashedPassword,
      address,
      profileImage,
      isOpen: srtToBoolean,
    });
  }
  /*사용자 삭제*/
  async userDelete(userId: number, password: string) {
    const user = await this.userRepository.findOne({
      select: ['password'],
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!compare(password, user.password)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    return this.userRepository.delete(userId);
  }
  /*사용자 조회(이메일)*/
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
