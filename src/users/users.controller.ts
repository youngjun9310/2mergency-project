import { Controller, Get, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserInfo } from '../auth/decorator/userInfo.decorator'
import { Users } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
        private readonly usersService: UsersService,
        ) {}

  /** 전체 사용자 조회(어드민용)*/
  @ApiOperation({ summary: '전체 사용자 조회', description: '전체 조회' })
  @UseGuards(RolesGuard)
  @Get('allUser')
  async findAllUser() {
    const userInfo = await this.usersService.findAllUser();
    return userInfo ;
  }

  /** 사용자 조회*/
  @ApiOperation({ summary: '사용자 조회', description: '조회' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/')
  async findUser(@UserInfo() user: Users , @Req() req) {
    const { userId } = req.user;

    const userInfo = await this.usersService.findUser(userId);
    return userInfo ;
  }

  /** 사용자 수정*/
  @ApiOperation({ summary: '사용자 정보수정', description: '수정' })
  @UseGuards(AuthGuard('jwt'))
  @Patch('')
  async userUpdate(@Body() updateDto: UpdateDto, @Req() req) {
    const { userId } = req.user;

   await this.usersService.userUpdate(
      userId, updateDto );
    return ;
  }

  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('')
  async userDelete(@Body() deleteDto: DeleteDto, @Req() req) {
    const { userId } = req.user;
    await this.usersService.userDelete(userId, deleteDto.password)

    return ;
  }

  /** 사용자 접속정보조회*/
  @ApiOperation({ summary: '사용자 접속정보조회', description: '접속정보조회' })
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getUserInfo(@UserInfo() user: Users) {
    return { 이메일: user.email, 닉네임: user.nickname };
  }

}