import { Controller, Get, Post, Body, Param, Delete, UseGuards, Render } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create_record.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';


// 유저 토큰
@UseGuards(JWTAuthGuard)
@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService
  ) {}


  // 레코드 생성
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '레코드 생성 API', description: '운동 기록을 기록!' })
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() createRecordDto: CreateRecordDto, @UserInfo() users : Users) {
    return await this.recordsService.create(users.userId, createRecordDto);
  }

  // 레코드 모든 목록 조회
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '레코드 내 모든 목록 조회 API', description: '내 모든 운동 기록들을 조회!' })
  @ApiBearerAuth('access-token')
  @Get('/myall')
  async findAll(@UserInfo() users : Users) {
    return await this.recordsService.findAll(users.userId);
  }

  // 레코드 모든 목록 조회
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '레코드 모든 목록 조회 API', description: '사람들의 모든 운동 기록들을 조회!' })
  @ApiBearerAuth('access-token')
  @Get('/recordall')
  async recordall() {
    return await this.recordsService.recordall();
  }

  // 레코드 상세 목록 조회
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '레코드 상세 목록 조회 API', description: '나의 운동 기록들을 조회!' })
  @ApiBearerAuth('access-token')
  @Get('/:recordId')
  async findOne(@Param('recordId') recordId: number, @UserInfo() users : Users) {
    return await this.recordsService.findOne(recordId, users.userId);
  }

  // 레코드 삭제
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '레코드 삭제 API', description: '나의 운동 기록을 삭제!' })
  @ApiBearerAuth('access-token')
  @Delete('/:recordId')
  async remove(@Param('recordId') recordId: number, @UserInfo() users : Users ) {
    return await this.recordsService.remove(recordId, users.userId);
  }

  /** hbs 양식 */
  // 기록 생성
  @Get('/records_h/recordcreate')
  @Render('recordcreate')
  async recordcreate(){
    return;
  }

  // 기록 모든 목록 조회
  @Get('/records_h/recordall')
  @Render('recordall')
  async recordsall(@UserInfo() users : Users){
    const records = await this.recordsService.findAll(users.userId);
    return {
      record : records.record
    };
  }

  // 기록 상세 목록 조회
  @Get('/:recordId/records_h/recordlist')
  @Render('recordlist')
  async recordlist(@Param('recordId') recordId : number, @UserInfo() users : Users){
    const record = await this.recordsService.findOne(recordId, users.userId);
    return {
      records : record.record
    };
  }
}
