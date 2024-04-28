import { Controller, Get, Post, Body, Param, Delete, UseGuards, Render } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create_record.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';


// 유저 토큰
@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService
  ) {}


  // 레코드 생성
  @UseGuards(JWTAuthGuard)
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '레코드 생성 API', description: '운동 기록을 기록!' })
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() createRecordDto: CreateRecordDto, @UserInfo() users : Users) {
    return await this.recordsService.create(users.userId, createRecordDto, users);
  }

  // 내 레코드 모든 목록 조회
  @UseGuards(JWTAuthGuard)
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '레코드 내 모든 목록 조회 API', description: '내 모든 운동 기록들을 조회!' })
  @ApiBearerAuth('access-token')
  @Get('')
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
  @UseGuards(JWTAuthGuard)
  @ApiResponse({ description: '성공', status: 200 })
  @ApiOperation({ summary: '레코드 상세 목록 조회 API', description: '나의 운동 기록들을 조회!' })
  @ApiBearerAuth('access-token')
  @Get('/:recordId')
  async findOne(@Param('recordId') recordId: number, @UserInfo() users : Users) {
    return await this.recordsService.findOne(recordId, users.userId);
  }

  // 레코드 삭제
  @UseGuards(JWTAuthGuard)
  @ApiResponse({ description: '성공', status: 201 })
  @ApiOperation({ summary: '레코드 삭제 API', description: '나의 운동 기록을 삭제!' })
  @ApiBearerAuth('access-token')
  @Delete('/:recordId')
  async remove(@Param('recordId') recordId: number, @UserInfo() users : Users ) {
    return await this.recordsService.remove(recordId, users.userId);
  }

  /** hbs 양식 */
  // 기록 생성
  @UseGuards(JWTAuthGuard)
  @Get('/records_h/recordcreate')
  @Render('recordcreate')
  async recordcreate(@UserInfo() users : Users){
    return{
      users : users
    };
  }

  // 내 기록 모든 목록 조회
  @UseGuards(JWTAuthGuard)
  @Get('/records_h/recordmylist')
  @Render('recordmylist')
  async recordmylist(@UserInfo() users : Users){
    const records = await this.recordsService.findAll(users.userId);
    return {
      record : records.record,
      users : users
    };
  }

  // 기록 모든 목록 조회
  @Get('/records_h/recordall')
  @Render('recordall')
  async recordlistall(@UserInfo() users : Users){
    const records = await this.recordsService.recordall();
    return {
      record : records.record,
      users : users
    };
  }

  // 기록 상세 목록 조회
  @UseGuards(JWTAuthGuard)
  @Get('/:recordId/records_h/recordlist')
  @Render('recordlist')
  async recordlist(@Param('recordId') recordId : number, @UserInfo() users : Users){
    const record = await this.recordsService.findOne(recordId, users.userId);
    return {
      records : record.record,
      users : users
    };
  }

  // 지도 Maps
  @UseGuards(JWTAuthGuard)
  @Get('/records_h/recordTrack')
  @Render('recordTrack')
  async maps(@UserInfo() users : Users){
    return {
      users : users
    };
  }
}
