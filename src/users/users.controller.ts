import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, UseGuards, Req, ForbiddenException, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserInfo } from '../auth/decorator/userInfo.decorator'
import { Users } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService ) {}

  @ApiOperation({ summary: '회원가입' ,  description: '회원가입'})
  @Post('register')
  async register(@Body() signUpdto: SignUpDto) {
    const user = await this.usersService.register(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.adminPassword,
      signUpdto.address,
      signUpdto.profileImage,
      signUpdto.isAdmin,
      signUpdto.isOpen
    );
    return { statusCode: 201 , message: "회원가입에 성공하였습니다.", data: user };
  }

  @ApiOperation({ summary: '로그인', description: '로그인' })
  @Post('login')
  @HttpCode(204) 
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {

    const user = await this.usersService.login(loginDto.email, loginDto.password);

    res.cookie('authorization', `Bearer ${user.accessToken}`);
    //res.cookie('refreshToken', user.refreshToken);
  
    return ;
  }

  @ApiOperation({ summary: '사용자 접속정보조회', description: '접속정보조회' })
  @UseGuards(AuthGuard('jwt'))
  @Get('')
  getUser(@UserInfo() user: Users) {
    return { 이메일: user.email, 닉네임: user.nickname };
  }

  @ApiOperation({ summary: '로그아웃', description: '로그아웃' })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(204)
  logOut( @Res({ passthrough: true }) res: Response) {

    res.clearCookie('authorization');
    //res.clearCookie('refreshToken');
    return ;
  }
  @ApiOperation({ summary: '사용자 정보수정', description: '수정' })
  @UseGuards(RolesGuard)
  @Patch('')
  async userUpdate(@Body() updateDto: UpdateDto, @Req() req) {
    const { userId } = req.user;

    const userUpdate = await this.usersService.userUpdate(
      userId, updateDto );
    return ;
  }

  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @UseGuards(RolesGuard)
  @Delete('')
  async userDelete(@Body() deleteDto: DeleteDto, @Req() req) {
    const { userId } = req.user;
    const result = await this.usersService.userDelete(userId, deleteDto.password)

    return ;
  }
}
