import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateRecordDto } from "./dto/create_record.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Records } from "./entities/record.entity";
import { Repository } from "typeorm";
import { Users } from "src/users/entities/user.entity";

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Records) private recordsRepository: Repository<Records>,
    @InjectRepository(Users) private readonly usersrepository: Repository<Users>,
  ) {}

  // 기록 생성
  async create(userId: number, createRecordDto: CreateRecordDto, users: Users) {
    const user = await this.usersrepository.findOne({ where: { userId } });
    const { startTime, endTime, stackedDistance, startx, starty, endx, endy } = createRecordDto;

    if (!user) {
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    const recoardsave = await this.recordsRepository.create({
      userId,
      nickname: users.nickname,
      startTime,
      endTime,
      stackedDistance,
      startx,
      starty,
      endx,
      endy,
    });

    const save = await this.recordsRepository.save(recoardsave);

    return { statusCode: 201, message: "정상적으로 데이터가 기록되었습니다.", save };
  }

  // 내 기록 모든 목록 조회
  async findAll(userId: number) {
    const record = await this.recordsRepository.find({ where: { userId } });

    return { statusCode: 200, message: "정상적으로 모든 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

  // 기록 모든 목록 조회
  async recordall() {
    const record = await this.recordsRepository.find();

    return { statusCode: 200, message: "정상적으로 모든 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

  // 기록 상세 목록 조회
  async findOne(recordId: number, userId: number) {
    const record = await this.recordsRepository.findOne({ where: { recordId, userId } });

    if (!userId) {
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if (!record || record.recordId === null || record.userId === null) {
      throw new NotFoundException("데이터가 존재하지 않습니다.");
    }

    if (userId !== record.userId) {
      throw new BadRequestException("조회할 수 있는 권한이 없습니다.");
    }

    return { statusCode: 200, message: "정상적으로 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

  // 기록 삭제
  async remove(recordId: number, userId: number) {
    const record = await this.recordsRepository.findOne({ where: { recordId, userId } });

    if (!record) {
      throw new NotFoundException("기록 데이터가 존재하지 않습니다.");
    }

    if (userId !== record.userId) {
      throw new BadRequestException("조회할 수 있는 권한이 없습니다.");
    }

    await this.recordsRepository.remove(record);

    return { statusCode: 201, message: "정상적으로 기록 데이터가 삭제되었습니다." };
  }
}
