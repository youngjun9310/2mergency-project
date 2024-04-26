import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JWTAuthGuard)
@ApiTags('Position')
@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  // 좌표 데이터 생성
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '좌표 데이터 생성 API', description: '내 좌표 데이터를 기록!' })
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() createPositionDto: CreatePositionDto, @UserInfo() users : Users) {
    return await this.positionService.create(createPositionDto, users.userId);
  }


  // 좌표 데이터 모든 이력 조회
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '좌표 데이터 모든 이력 조회 API', description: '내 좌표 데이터 모든 이력 조회!' })
  @ApiBearerAuth('access-token')
  @Get()
  async findAll(@UserInfo() users : Users) {
    return await this.positionService.findAll(users.userId);
  }


  // 좌표 데이터 상세 조회
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '좌표 데이터 상세 조회 API', description: '좌표 데이터 상세 조회!' })
  @ApiBearerAuth('access-token')
  @Get('/:positionId')
  async findOne(@Param('positionId') positionId : number, @UserInfo() users : Users) {
    return await this.positionService.findOne(positionId, users.userId);
  }


  // 좌표 데이터 삭제
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '좌표 데이터 삭제 API', description: '내 좌표 데이터를 삭제!' })
  @ApiBearerAuth('access-token')
  @Delete('/:positionId')
  async remove(@Param('positionId') positionId : number, @UserInfo() users : Users) {
    return await this.positionService.remove(positionId, users.userId);
  }
}
