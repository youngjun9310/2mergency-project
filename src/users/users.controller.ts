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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @Get('allUser')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '전체 사용자 조회', description: '어드민용: 시스템에 등록된 모든 사용자를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 전체 사용자 목록 조회하였습니다.' })
  @UseGuards(RolesGuard)
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  /** 사용자 조회*/
  @Get('/')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '개인 사용자 조회', description: '현재 로그인한 사용자의 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 조회하였습니다.' })
  async findUser(@UserInfo() users: Users) {
    return await this.usersService.findUser(users.userId);
  }

  /** 사용자 수정*/
  @Patch('update')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 정보 수정', description: '사용자의 정보와 프로필 이미지를 수정합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보가 업데이트 되었습니다.' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '사용자 정보와 프로필 이미지를 업데이트',
    type: UpdateDto,
  })
  async userUpdate(@Body() updateDto: UpdateDto, @UploadedFile() file: Express.Multer.File, @UserInfo() users: Users) {
    return await this.usersService.userUpdate(users.userId, updateDto, file);
  }

  /** 사용자 삭제*/
  @Delete('delete')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 삭제', description: '사용자의 계정을 삭제합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 계정이 삭제되었습니다.' })
  async userDelete(@Body() deleteDto: DeleteDto, @UserInfo() users: Users) {
    return await this.usersService.userDelete(users.userId, deleteDto.password);
  }

  /** 사용자 접속정보조회*/
  @Get('info')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 접속 정보 조회', description: '사용자의 기본 접속 정보를 조회합니다.' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 접속 정보를 조회하였습니다.' })
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
  async users(@UserInfo() users: Users, groupId: number) {
    const user = await this.usersService.findUser(users.userId);
    const groups = await this.usersService.findGroupId(groupId);
    return {
      user: user,
      groups: groups,
    };
  }

  // 유저 정보 수정
  @Get('users_h/userEdit')
  @Render('userEdit')
  async userEditpage(@UserInfo() users: Users, gorupId: number) {
    const groups = await this.usersService.findGroupId(gorupId);
    return {
      users: users,
      groups: groups,
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
  async userDeletepage(@UserInfo() users: Users, groupId: number) {
    const groups = await this.usersService.findGroupId(groupId);
    return {
      users: users,
      groups: groups,
    };
  }
}
