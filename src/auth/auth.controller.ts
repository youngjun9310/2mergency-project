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
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { MailService } from 'src/mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from './guard/jwt.guard';
import { Response } from 'express';

@ApiTags('Auth') // 'Auth' 태그를 이용해 스웨거 문서에서 이 컨트롤러의 엔드포인트를 그룹화
@Controller('auth') // 'auth' 경로에 대해 이 컨트롤러가 응답하도록 설정
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  /** 회원가입 */
  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '사용자를 등록합니다.' }) // 회원가입 기능에 대한 요약 및 설명
  @ApiResponse({ status: 201, description: '회원가입 성공' }) // 회원가입 성공 및 오류 시 응답 상태 코드와 설명
  @ApiConsumes('multipart/form-data') // 엔드포인트가 'multipart/form-data'를 처리함을 명시, 주로 파일 업로드에 사용
  @UseInterceptors(FileInterceptor('profileImage')) // FileInterceptor를 사용하여 'profileImage' 이름으로 업로드된 파일을 처리
  async register(@Body() signUpDto: SignUpDto, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.register(signUpDto, file);
  }

  /** 어드민 회원가입 */
  @Post('adminRegister')
  @ApiOperation({ summary: '어드민 회원가입', description: '어드민 사용자를 등록합니다.' })
  @ApiResponse({ status: 201, description: '어드민 회원가입 성공' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage'))
  async adminRegister(@Body() signUpDto: SignUpDto, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.adminRegister(signUpDto, file);
  }

  /** 로그인 */
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '사용자 로그인' })
  @ApiResponse({ status: 200, description: '로그인 성공' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.login(loginDto.email, loginDto.password);
    res.cookie('authorization', `Bearer ${accessToken}`, { httpOnly: true });
    return;
  }

  /** 로그아웃 */
  @Post('logout')
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃' })
  @ApiResponse({ status: 204, description: '로그아웃 성공' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authorization', { httpOnly: true });
    return;
  }

  /** hbs 양식 */
  // 회원가입 페이지
  @Get('/users_h/registerpage')
  @Render('registerpage')
  async registerpage() {
    return;
  }

  // 회원가입 로직(테스트버전, 이미지 업로드 불가 문제)
  @Post('/users_h/register')
  async registers(signUpdto: SignUpDto, @Body('file') file: Express.Multer.File) {
    const register = await this.authService.register(signUpdto, file);

    return {
      register: register,
    };
  }

  // 유저 이메일 인증요청
  @Get('/users_h/emailsend')
  @Render('emailsend')
  async emailsend() {
    return;
  }

  // 유저 이메일 인증
  @Get('/users_h/emailaccept')
  @Render('emailaccept')
  async emailaccept() {
    return;
  }

  // 유저 로그인
  @Get('/users_h/login')
  @Render('login')
  async logins() {
    return;
  }

  // 로그아웃
  @Get('/logout')
  async logout() {
    return;
  }
}
