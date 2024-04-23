import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from './guard/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  /** 회원가입*/
  @ApiOperation({ summary: '회원가입', description: '회원가입' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Post('register')
  async register(
    @Body() signUpdto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.authService.register(
      signUpdto,
      file,
    );
    return { statusCode: 201, message: '회원가입에 성공하였습니다.' };
  }

  /** 어드민 회원가입*/
  @ApiOperation({ summary: '어드민 회원가입', description: '어드민 회원가입' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Post('adminRegister')
  async adminRegister(
    @Body() signUpdto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.authService.adminRegister(
      signUpdto.nickname,
      signUpdto.email,
      signUpdto.password,
      signUpdto.passwordConfirm,
      signUpdto.adminPassword,
      signUpdto.address,
      file,
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
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('authorization', `Bearer ${accessToken}`);
    return;
  }

  /** 로그아웃*/
  @ApiOperation({ summary: '로그아웃', description: '로그아웃' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(204)
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authorization');
    return;
  }

  /** 이메일 가입초대*/
  @ApiOperation({
    summary: '이메일 가입초대',
    description: '가입 토큰번호 전송',
  })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
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
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('accept')
  async userAccept(
    @Body('email') email: string,
    @Body('token') token: string,
    @Res() res,
  ) {
    await this.authService.userAccept(email, token);
    res.send('회원가입 이메일 인증을 완료했습니다.');
  }

  /** 사용자 이미지업로드 */
  @ApiOperation({ summary: '사용자 이미지업로드', description: '이미지업로드' })
  @ApiBearerAuth('access-token')
  @Post('uploadImg')
  async uploadImg() {}


  /** hbs 양식 */
  // 회원가입 페이지
  @Get('/users_h/registerpage')
  @Render('registerpage')
  async registerpage(){
    return;
  }

  // 회원가입 로직(테스트버전, 이미지 업로드 불가 문제)
  @Post('/users_h/register')
  async registers( 
    signUpdto : SignUpDto,
    @Body('file')file: Express.Multer.File ) {
    const register = await this.authService.register(signUpdto, file);
    
    return {
      register : register
    };
  }

  // 유저 로그인
  @Get('/users_h/login')
  @Render('login')
  async logins(){
    return;
  }

  // 로그아웃
  @Get('/logout')
  async logout(){
    return;
  }
}
