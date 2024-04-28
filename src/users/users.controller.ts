import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Render,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserInfo } from '../auth/decorator/userInfo.decorator';
import { Users } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JWTAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** 전체 사용자 조회(어드민용)*/
  @ApiOperation({ summary: '전체 사용자 조회 API', description: '사용자 전체 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 전체 사용자 조회를 완료했습니다.' })
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Get('allUser')
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  /** 사용자 조회*/
  @ApiOperation({ summary: '사용자 조회 API', description: '사용자 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 조회하였습니다.' })
  @ApiBearerAuth('access-token')
  @Get('/')
  async findUser(@UserInfo() users: Users) {
    return await this.usersService.findUser(users.userId);
  }

  /** 사용자 수정*/
  @ApiOperation({ summary: '사용자 정보 수정 API', description: '사용자 정보 수정 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 수정하였습니다.' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiBearerAuth('access-token')
  @Patch('')
  async userUpdate(@Body() updateDto: UpdateDto, @UploadedFile() file: Express.Multer.File, @UserInfo() users: Users) {
    return await this.usersService.userUpdate(users.userId, updateDto, file);
  }

  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제 API', description: '사용자 삭제 성공' })
  @ApiResponse({ status: 204, description: '성공적으로 사용자를 삭제 하였습니다.' })
  @ApiBearerAuth('access-token')
  @Delete('')
  async userDelete(@Body() deleteDto: DeleteDto, @UserInfo() users: Users) {
    return await this.usersService.userDelete(users.userId, deleteDto.password);
  }

  /** 사용자 접속정보조회*/
  @ApiOperation({ summary: '사용자 접속정보조회 API', description: ' 사용자 접속정보조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자의 접송 정보를 조회하였습니다.' })
  @ApiBearerAuth('access-token')
  @Get('info')
  getUserInfo(@UserInfo() users: Users) {
    return { 이메일: users.email, 닉네임: users.nickname };
  }

  /** hbs 양식 */
  // 유저 모든 목록 조회
  @UseGuards(RolesGuard)
  @Get('users_h/userall')
  @Render('userall')
  async findall() {
    const users = await this.usersService.findAllUser();
    return {
      user: users,
    };
  }

  // 유저 마이 정보 조회
  @Get('/users_h/usermypage')
  @Render('usermypage')
  async users(@UserInfo() users: Users) {
    const user = await this.usersService.findUser(users.userId);
    const records = await this.usersService.findrecord(users.userId);
    return {
      user: user,
      records : records
    };
  }

  // 유저 정보 수정
  @Get('users_h/userEdit')
  @Render('userEdit')
  async userEditpage(@UserInfo() users: Users) {
    return {
      users: users,
    };
  }

  // 유저 정보 수정(로직 테스트, 이미지 업로드 불가 문제)
  @Post('/userEdit')
  async userEdit(@UserInfo() users: Users, updateDto: UpdateDto, @Body('file') file: Express.Multer.File) {
    await this.usersService.userUpdate(users.userId, updateDto, file);
    return {
      message: '유저 정보가 업데이트 되었습니다.',
    };
  }

  // 유저 회원 탈퇴
  @Get('/users_h/userDelete')
  @Render('userDelete')
  async userDeletepage(@UserInfo() users: Users) {
    return {
      users: users,
    };
  }
}
