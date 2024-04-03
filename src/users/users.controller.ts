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
import { MailService } from 'src/mail/mail.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
        ) {}

  /** 회원가입*/
  @ApiOperation({ summary: '회원가입' ,  description: '회원가입'})
  @Post('register')
  async register(@Body() signUpdto: SignUpDto) {
    const user = await this.usersService.register(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.address,
      signUpdto.profileImage,
      signUpdto.isOpen
    );
    return { statusCode: 201 , message: "회원가입에 성공하였습니다." };
  }

  /** 어드민 회원가입*/
  @ApiOperation({ summary: '어드민 회원가입' ,  description: '어드민 회원가입'})
  @Post('adminRegister')
  async adminRegister(@Body() signUpdto: SignUpDto) {
    const user = await this.usersService.adminRegister(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.adminPassword,
      signUpdto.address,
      signUpdto.profileImage,
      signUpdto.isOpen
    );
    return { statusCode: 201 , message: "운영자 회원가입에 성공하였습니다." };
  }

  /** 로그인*/
  @ApiOperation({ summary: '로그인', description: '로그인' })
  @Post('login')
  @HttpCode(204) 
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {

    const user = await this.usersService.login(loginDto.email, loginDto.password);

    res.cookie('authorization', `Bearer ${user.accessToken}`);
    //res.cookie('refreshToken', user.refreshToken);
  
    return ;
  }

  /** 로그아웃*/
  @ApiOperation({ summary: '로그아웃', description: '로그아웃' })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(204)
  logOut( @Res({ passthrough: true }) res: Response) {

    res.clearCookie('authorization');
    //res.clearCookie('refreshToken');
    return ;
  }

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

    const userUpdate = await this.usersService.userUpdate(
      userId, updateDto );
    return ;
  }

  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('')
  async userDelete(@Body() deleteDto: DeleteDto, @Req() req) {
    const { userId } = req.user;
    const result = await this.usersService.userDelete(userId, deleteDto.password)

    return ;
  }

  /** 이메일 가입초대*/
  @ApiOperation({summary: '이메일 가입초대', description: '가입 토큰번호 전송'})
  @UseGuards(AuthGuard('jwt'))
  @Post('invite')
  async userInvite(@Body('email') email: string, @Res() res ){
    const gentoken = await this.mailService.usersendMail(email);
    await this.usersService.userInvite(email,gentoken);
    res.send('회원가입 토큰번호를 전송했습니다.');
    
  }

  /** 이메일 가입수락*/
  @ApiOperation({summary: '이메일 가입초대', description: '이메일 가입 토큰번호 전송'})
  @Post('accept')
  async userAccept(@Body('email') email: string, @Body('token') token: string, @Res() res){
    await this.usersService.userAccept(email, token);
    res.send('회원가입 이메일 인증을 완료했습니다.');
    
  }

  /** 사용자 접속정보조회*/
  @ApiOperation({ summary: '사용자 접속정보조회', description: '접속정보조회' })
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getUserInfo(@UserInfo() user: Users) {
    return { 이메일: user.email, 닉네임: user.nickname };
  }

}