import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class PositionService {
  constructor( @ InjectRepository(Position) 
  private positionRepository : Repository<Position>,
  @InjectRepository(Users) private usersRepository : Repository<Users>){}

  // 좌표 데이터 생성
  async create(createPositionDto: CreatePositionDto, userId : number) {
    const { startx, starty, endx, endy, latitude, longitude } = createPositionDto;
    const user = await this.usersRepository.findOne({ where : { userId }});

    if(!user){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    const position = await this.positionRepository.create({
      userId,
      startx,
      starty,
      endx,
      endy,
      latitude,
      longitude
    });

    await this.positionRepository.save(position);

    return { statusCode : 201, message : "정상적으로 좌표 데이터 생성에 성공하였습니다." };
  }


  // 좌표 데이터 모든 이력 조회
  async findAll(userId : number) {
    const position = await this.positionRepository.find({ where : { userId }});
    return { statusCode : 200, message : "정상적으로 모든 내 좌표 데이터 이력 조회에 성공하였습니다.", position };
  }

  // 좌표 데이터 상세 조회
  async findOne(positionId: number, userId : number) {
    const position = await this.positionRepository.findOne({ where : { positionId, userId } });

    if(!position || position.positionId === null || position.userId === null){
      throw new NotFoundException("데이터가 존재하지 않습니다.");
    }

    if(!userId){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(userId !== position.userId){
      throw new UnauthorizedException("조회할 수 있는 권한이 없습니다.");
    }
    
    return { statusCode : 200, message : "정상적으로 좌표 상세 데이터 이력 조회에 성공하였습니다.", position };
  }

  // 좌표 데이터 삭제
  async remove(positionId: number, userId : number) {
    const position = await this.positionRepository.findOne({ where : { positionId, userId}});

    if(!position || position.positionId === null || position.userId === null){
      throw new NotFoundException("데이터가 존재하지 않습니다.");
    }

    if(!userId){
      throw new NotFoundException("유저가 존재하지 않습니다.");
    }

    if(userId !== position.userId){
      throw new UnauthorizedException("접근할 수 없습니다.");
    }

    await this.positionRepository.remove(position);

    return { statusCode : 201, message : "정상적으로 좌표 데이터가 삭제되었습니다." };
  }
}
