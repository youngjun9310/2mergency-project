import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecordDto } from './dto/create_record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Records } from './entities/record.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class RecordsService {
  constructor(@InjectRepository(Records) private recordsrepository : Repository<Records>,
  @InjectRepository(Users) private readonly usersrepository : Repository<Users>){}

  // 레코드 생성
  async create(userId : number, createRecordDto: CreateRecordDto) {
    const user = await this.usersrepository.findOne({ where : { userId } });
    const { startTime, endTime ,stackedDistance, startx, starty, endx, endy } = createRecordDto;
    
    if(!user){
      throw new NotFoundException("NotExistingUserError");
    }

    const recoardsave = await this.recordsrepository.create({
      userId,
      startTime,
      endTime,
      stackedDistance,
      startx,
      starty,
      endx,
      endy
    });
    const save = await this.recordsrepository.save(recoardsave);

    return { statusCode : 201, message : "정상적으로 데이터가 기록되었습니다.", save };
  }

  // 레코드 내 모든 목록 조회
  async findAll(userId : number) {
    const record = await this.recordsrepository.find({ where : { userId }});

    return { statusCode : 200, message : "정상적으로 모든 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

  // 레코드 모든 목록 조회
  async recordall() {
    const record = await this.recordsrepository.find();

    return { statusCode : 200, message : "정상적으로 모든 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

  // 레코드 상세 목록 조회
  async findOne(recordId: number, userId : number) {
    const record = await this.recordsrepository.findOne({ where : { recordId, userId } });

    if(!userId){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(!record || record.recordId === null || record.userId === null){
      throw new NotFoundException("데이터가 존재하지 않습니다.");
    }

    if(userId !== record.userId){
      throw new BadRequestException("조회할 수 있는 권한이 없습니다.");
    }   
    return { statusCode : 200, message : "정상적으로 기록 데이터 이력 조회에 성공하였습니다.", record };
  }

   // 레코드 삭제
   async remove(recordId: number, userId : number) {
    const record = await this.recordsrepository.findOne({ where : { recordId, userId }})

    if(!record){
      throw new NotFoundException("기록 데이터가 존재하지 않습니다.");
    }

    if(userId !== record.userId){
      throw new BadRequestException("조회할 수 있는 권한이 없습니다.");
    }

    await this.recordsrepository.remove(record);
    
    return { statusCode : 201, message : "정상적으로 기록 데이터가 삭제되었습니다." };
  }

}
