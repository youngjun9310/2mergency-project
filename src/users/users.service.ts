import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "./entities/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { UpdateDto } from "./dto/update.dto";
import { AwsService } from "src/aws/aws.service";
import { Records } from "src/records/entities/record.entity";
import { ENV_PASSWORD_HASH_ROUNDS } from "src/const/env.keys";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Records)
    private recordsRepository: Repository<Records>,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}

  /*전체 사용자 조회(어드민용)*/
  async findAllUser() {
    return await this.userRepository.find();
  }
  /*사용자 조회*/
  async findUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (user.CertificationStatus === false) {
      throw new UnauthorizedException("EmailAuthError");
    }

    return user;
  }
  /*사용자 수정*/
  async userUpdate(userId: number, updateDto: UpdateDto, file: Express.Multer.File) {
    const { email, password, passwordConfirm, address, isOpen } = updateDto;
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    if (password !== passwordConfirm) {
      throw new UnauthorizedException("PasswordError");
    }

    if (user.CertificationStatus === false) {
      throw new UnauthorizedException("이메일 인증을 진행해주세요.");
    }

    const profileImage = await this.awsService.imageUpload(file);
    const srtToBoolean = Boolean(isOpen === "true");
    const hashedPassword = await hash(password, this.configService.get<number>(ENV_PASSWORD_HASH_ROUNDS));
    this.userRepository.update(userId, {
      email,
      password: hashedPassword,
      address,
      profileImage,
      isOpen: srtToBoolean,
    });
    return { statusCode: 204, message: "회원 정보를 수정하였습니다." };
  }
  /*사용자 삭제*/
  async userDelete(userId: number, password: string) {
    const user = await this.userRepository.findOne({
      select: ["password"],
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException("PasswordError");
    }
    this.userRepository.delete(userId);
    return { statusCode: 200, message: "회원 탈퇴가 정상 처리 되었습니다." };
  }
  /*사용자 조회(이메일)*/
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  /*사용자 조회(이메일)*/
  async findId(userId: number) {
    const users = await this.userRepository.findOne({ where: { userId } });

    if (!users) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }

    return users;
  }

  /*recordId 조회*/
  async findrecord(userId: number) {
    const records = await this.recordsRepository.find({ where: { userId } });

    if (!records) {
      throw new NotFoundException("기록 데이터가 존재하지 않습니다.");
    }

    return records;
  }
}
