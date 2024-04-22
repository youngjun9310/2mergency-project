import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { JWTAuthGuard } from './auth/guard/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { UserInfo } from './auth/decorator/userInfo.decorator';
import { Users } from './users/entities/user.entity';
import { SignUpDto } from './auth/dto/signup.dto';

@ApiTags('Handlebars(HBS)')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private userService: UsersService,
    private authservice: AuthService,
  ) {}
  @Get('/')
  @Render('index')
  root() {
    return { message: 'data' };
  }

  // 유저 마이 정보 조회
  @UseGuards(JWTAuthGuard)
  @Get('/users_h/usermypage')
  @Render('usermypage')
  async users(@UserInfo() users: Users) {
    const user = await this.userService.findUser(users.userId);
    return {
      user: user,
    };
  }

  // 회원가입 페이지
  @Get('/users_h/registerpage')
  @Render('registerpage')
  async registerpage() {
    return;
  }

  // 회원가입 로직(테스트버전)
  @Post('/register')
  async register(@Body('signUpDto') signUpDto: SignUpDto, @Body('file') file: Express.Multer.File) {
    const register = await this.authservice.register(signUpDto, file);
    return {
      register: register,
    };
  }

  // 유저 모든 목록 조회(아직 안됨)
  // @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Get('users_h/alluser')
  @Render('alluser')
  async findall() {
    const users = await this.userService.findAllUser();
    return {
      user: users,
    };
  }

  // 유저 로그인
  @Get('/users_h/login')
  @Render('login')
  async login() {
    return;
  }

  // 그룹 생성
  @UseGuards(JWTAuthGuard)
  @Get('/groups_h/groupcreate')
  @Render('groupcreate')
  async groupcreate() {
    return;
  }

  // 스케줄 생성
  @UseGuards(JWTAuthGuard)
  @Get('/schedules_h/schedulescreate')
  @Render('schedulescreate')
  async schedulescreate() {
    return;
  }
}
