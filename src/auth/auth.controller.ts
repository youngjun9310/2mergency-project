import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  /** 회원가입*/
  @ApiOperation({ summary: '회원가입', description: '회원가입' })
  @Post('register')
  async register(@Body() signUpdto: SignUpDto) {
    const user = await this.authService.register(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.address,
      signUpdto.profileImage,
      signUpdto.isOpen,
    );
    return { statusCode: 201, message: '회원가입에 성공하였습니다.' };
  }

  /** 어드민 회원가입*/
  @ApiOperation({ summary: '어드민 회원가입', description: '어드민 회원가입' })
  @Post('adminRegister')
  async adminRegister(@Body() signUpdto: SignUpDto) {
    const user = await this.authService.adminRegister(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.adminPassword,
      signUpdto.address,
      signUpdto.profileImage,
      signUpdto.isOpen,
    );
    return { statusCode: 201, message: '운영자 회원가입에 성공하였습니다.' };
  }

  /** 로그인*/
  @ApiOperation({ summary: '로그인', description: '로그인' })
  @Post('login')
  @HttpCode(204)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    res.cookie('authorization', `Bearer ${user.accessToken}`);
    //res.cookie('refreshToken', user.refreshToken);

    return;
  }

  /** 로그아웃*/
  @ApiOperation({ summary: '로그아웃', description: '로그아웃' })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(204)
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authorization');
    //res.clearCookie('refreshToken');
    return;
  }

  /** 이메일 가입초대*/
  @ApiOperation({
    summary: '이메일 가입초대',
    description: '가입 토큰번호 전송',
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('invite')
  async userInvite(@Body('email') email: string, @Res() res) {
    const gentoken = await this.mailService.usersendMail(email);
    await this.authService.userInvite(email, gentoken);
    res.send('회원가입 토큰번호를 전송했습니다.');
  }

  /** 이메일 가입수락*/
  @ApiOperation({
    summary: '이메일 가입초대',
    description: '이메일 가입 토큰번호 전송',
  })
  @Post('accept')
  async userAccept(
    @Body('email') email: string,
    @Body('token') token: string,
    @Res() res,
  ) {
    await this.authService.userAccept(email, token);
    res.send('회원가입 이메일 인증을 완료했습니다.');
  }
}
