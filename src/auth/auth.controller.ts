import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: '회원가입 API', description: '회원가입 성공' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Post('register')
  //@Redirect('/')
  @ApiResponse({ status: 201, description: '회원가입 성공하였습니다.' })
  async register(@Body() signUpdto: SignUpDto,
  @UploadedFile() file: Express.Multer.File,
  @Res() res: Response) {
    try {
      await this.authService.register(
        signUpdto,
        file,
      );
      await this.userInvite(signUpdto.email, res)
      res.render('login')
      //return { url:'/auth/users_h/login', message: '회원가입에 성공하였습니다.'};
      
    } catch (error) {
      //res.redirect('/auth/users_h/registerpage');
      res.render('registerpage');
     
    }
    
  }

  /** 어드민 회원가입*/
  @ApiOperation({ summary: '어드민 회원가입 API', description: '어드민 회원가입 성공' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @Post('adminRegister')
  @ApiResponse({ status: 201, description: '어드민 회원가입에 성공하였습니다.' })
  async adminRegister(@Body() signUpdto: SignUpDto, @UploadedFile() file: Express.Multer.File) {
    return await this.authService.adminRegister(signUpdto, file);
  }

  /** 로그인*/
  @ApiOperation({ summary: '로그인 API', description: '로그인 성공' })
  @Post('login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: '로그인에 성공하였습니다.' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.login(loginDto.email, loginDto.password);

      res.status(302).send(`
            <script>
              alert("로그인 성공");
              window.location.href = '/Dashboard';
            </script>
          `);

    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'NotExistingUser') {
        res.status(302).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if (errorMsg === 'PasswordError') {
        res.status(302).send(`
          <script>
            alert("비밀번호를 다시 확인해주시기바랍니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if (errorMsg === 'EmailAuthError') {
        res.status(302).send(`
          <script>
            alert("이메일 인증이 필요합니다.");
            window.location.href = '/auth/users_h/emailaccept';
          </script>
        `);
      } else {
        res.status(302).send(`
          <script>
            alert("로그인을 다시 시도해주십시오.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  /** 로그아웃*/
  @ApiOperation({ summary: '로그아웃 API', description: '로그아웃 성공' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: '로그아웃에 성공하였습니다.' })
  logOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authorization');
    return;
  }

  /** 이메일 가입초대*/
  @ApiOperation({
    summary: '이메일 가입초대 API',
    description: '가입 토큰번호 전송',
  })
  @Post('invite')
  @ApiResponse({ status: 200, description: '이메일 가입 초대에 성공하였습니다.' })
  async userInvite(@Body('email') email: string, @Res() res) {
    const gentoken = await this.mailService.usersendMail(email);
    await this.authService.userInvite(email, gentoken);
    //res.send('회원가입 토큰번호를 전송했습니다.');
    return;
  }

  /** 이메일 가입수락*/
  @ApiOperation({
    summary: '이메일 가입초대 API',
    description: '이메일 가입 토큰번호 전송',
  })
  @ApiResponse({ status: 200, description: '이메일 가입 수락에 성공하였습니다.' })
  @Post('accept')
  //@Redirect('/')
  async userAccept( @Body('email') email: string, @Body('token') token: string, @Res() res ){
    try {
      await this.authService.userAccept(email, token);
      //res.send('회원가입 이메일 인증을 완료했습니다.');
      res.redirect('/auth/users_h/login')
      //return { url:'/auth/users_h/login', message: '회원가입 이메일 인증을 완료했습니다.'}; 
    } catch (error) {
      const message = error.response.message
      
      if(message=='TokenNotExistError'){
        console.log(message)
        res.redirect('/auth/users_h/emailAccept')
      } 
    }
    
  }

  /** hbs 양식 */
  // 첫 welcome 화면
  @Get('/users_h/welcomePage')
  @Render('welcomePage')
  async userWelcome(){
    return;
  }
  
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
  async logins(){
    return ;
  }

  // 로그아웃
  @UseGuards(JWTAuthGuard)
  @Get('/logout')
  async logout() {
    return;
  }

  // 이메일가입초대
  @Get('/users_h/emailInvite')
  @Render('emailInvite')
  async userEmailInvite(){
    return;
  }

  // 이메일가입수락
  @Get('/users_h/emailAccept')
  @Render('emailAccept')
  async userEmailAccept(){
    return;
  }
  
}
