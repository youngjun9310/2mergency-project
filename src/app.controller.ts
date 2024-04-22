import { Body, Controller, Delete, Get, NotFoundException, Patch, Post, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { JWTAuthGuard } from './auth/guard/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';
import { UserInfo } from './auth/decorator/userInfo.decorator';
import { Users } from './users/entities/user.entity';
import { RolesGuard } from './auth/guard/roles.guard';
import { GroupsService } from './groups/groups.service';
import { RecordsService } from './records/records.service';
import { SchedulesService } from './schedules/schedules.service';
import { UpdateDto } from './users/dto/update.dto';


@ApiTags('Handlebars(HBS)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private userService : UsersService,
    private authservice : AuthService,
    private groupsService : GroupsService,
    private recordsService : RecordsService,
    private schedulesService : SchedulesService
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
  async users( @UserInfo() users : Users ) {
    const user = await this.userService.findUser(users.userId);
    return {
      user : user
    };
  }

  
  // 회원가입 페이지
  @Get('/users_h/registerpage')
  @Render('registerpage')
  async registerpage(){
    return;
  }

  // 회원가입 로직(테스트버전)
  @Post('/register')
  async register( 
    @Body('nickname')nickname: string,
    @Body('email') email: string,
    @Body('password')password: string,
    @Body('passwordConfirm')passwordConfirm: string,
    @Body('address')address: string,
    @Body('isOpen')isOpen: string,
    @Body('file')file: Express.Multer.File ) {
    const register = await this.authservice.register(nickname, email, password, passwordConfirm, address, isOpen, file);
    return {
      register : register
    };
  }

  // 유저 모든 목록 조회
  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Get('users_h/alluser')
  @Render('alluser')
  async findall() {
    const users = await this.userService.findAllUser();
    return {
      user : users
    };
  }

  // 유저 정보 수정
  @UseGuards(JWTAuthGuard)
  @Get('users_h/userEdit')
  @Render('userEdit')
  async userEditpage() {
    return;
  }

  // 유저 정보 수정(로직 테스트)
  @UseGuards(JWTAuthGuard)
  @Patch('/userEdit')
  async userEdit(
    @UserInfo() users : Users,
    @Body() updateDto : UpdateDto,
    @Body('file')file: Express.Multer.File
  ) {
    await this.userService.userUpdate(users.userId, updateDto, file);
    return {
      message : "유저 정보가 업데이트 되었습니다."
    };
  }

  // 유저 삭제
  @UseGuards(JWTAuthGuard)
  @Delete('/users')
  async userDelete() {
    return;
  }

  // 유저 로그인
  @Get('/users_h/login')
  @Render('login')
  async login(){
    return;
  }
  
  // 로그아웃
  @UseGuards(JWTAuthGuard)
  @Get('/auth/logout')
  async logout(){
    return;
  }

  // 그룹 생성
  @Get('/groups_h/groupcreate')
  @Render('groupcreate')
  async groupcreate(){
    return;
  }
  
  // 그룹 모든 목록 조회
  @Get('/groups/groupsall')
  @Render('groupsall')
  async groupsall(){
    const groups = await this.groupsService.findAllGroups();
    return {
      groups : groups
    };
  }

  // 스케줄 생성
  @UseGuards(JWTAuthGuard)
  @Get('/schedules_h/schedulescreate')
  @Render('schedulescreate')
  async schedulescreate(){
    return;
  }

  // // 스케줄 모든 목록 조회
  // @UseGuards(JWTAuthGuard)
  // @Get('/schedules_h/schedulesall')
  // @Render('schedulesall')
  // async schedulesall(){
  //   const schedules = await this.schedulesService.getAllSchedule();
  //   return;
  // }
  
  // 기록 생성
  @UseGuards(JWTAuthGuard)
  @Get('/records_h/recordcreate')
  @Render('recordcreate')
  async recordcreate(){
    return;
  }

  // 기록 모든 목록 조회
  @UseGuards(JWTAuthGuard)
  @Get('/records_h/recordsall')
  @Render('recordsall')
  async recordsall(){
    const records = await this.recordsService.findAll();
    return {
      record : records.record
    };
  }


}
