import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Render,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserInfo } from '../auth/decorator/userInfo.decorator';
import { Users } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { GroupsService } from 'src/groups/groups.service';
import { Response } from 'express';

@UseGuards(JWTAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService

  ) {}
  
  /** 전체 사용자 조회(어드민용)*/
  @ApiOperation({ summary: '전체 사용자 조회', description: '전체 조회' })
  @UseGuards(RolesGuard)
  @ApiBearerAuth('access-token')
  @Get('allUser')
  async findAllUser() {
    return await this.usersService.findAllUser();
  }
  /** 사용자 조회*/
  @ApiOperation({ summary: '사용자 조회', description: '조회' })
  @ApiBearerAuth('access-token')
  @Get('/')
  async findUser(@UserInfo() user: Users, @Req() req) {
    const { userId } = req.user;
    const userInfo = await this.usersService.findUser(userId);
    return userInfo;
  }
  /** 사용자 수정*/
  @ApiOperation({ summary: '사용자 정보수정', description: '수정' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiBearerAuth('access-token')
  @Patch('')
  async userUpdate(
    @Body() updateDto: UpdateDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const { userId } = req.user;
    await this.usersService.userUpdate(userId, updateDto, file);
    return;
  }

  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @ApiBearerAuth('access-token')
  @Delete('')
  @Redirect('/user_h/welcomePage')
  async userDelete(@Body() deleteDto: DeleteDto, @Req() req, @Res() res: Response) {

    try {
      const { userId } = req.user;
      await this.usersService.userDelete(userId, deleteDto.password);
      return;
    } catch (error) {
      res.redirect('/auth/users_h/usermypage');
    }

    
  }

  /** 사용자 접속정보조회*/
  @ApiOperation({ summary: '사용자 접속정보조회', description: '접속정보조회' })
  @ApiBearerAuth('access-token')
  @Get('info')
  getUserInfo(@UserInfo() users: Users) {
    return { 이메일: users.email, 닉네임: users.nickname };
  }

  /** hbs 양식 */
  // 유저 모든 목록 조회
  @UseGuards(JWTAuthGuard)
  // @UseGuards(RolesGuard)
  @Get('users_h/userall')
  @Render('userall')
  async findall() {
    const users = await this.usersService.findAllUser();
    return {
      user : users
    };
  }

  // 유저 마이 정보 조회
  @UseGuards(JWTAuthGuard)
  @Get('/users_h/usermypage')
  @Render('usermypage')
  async users( @UserInfo() users : Users ) {
    const user = await this.usersService.findUser(users.userId);
    return {
      user : user
    };
  }

  // 유저 정보 수정
  @UseGuards(JWTAuthGuard)
  @Get('users_h/userEdit')
  @Render('userEdit')
  async userEditpage() {
    return;
  }

  // 유저 정보 수정(로직 테스트, 수정이 안됨)
  @UseGuards(JWTAuthGuard)
  @Post('/userEdit')
  async userEdit(
    @UserInfo() users : Users,
    updateDto : UpdateDto,
    @Body('file')file: Express.Multer.File
  ) {
    await this.usersService.userUpdate(users.userId, updateDto, file);
    return {
      message : "유저 정보가 업데이트 되었습니다."
    };
  }

   // 유저 회원 탈퇴
   @UseGuards(JWTAuthGuard)
   @Get('/users_h/userDelete')
   @Render('userDelete')
   async userDeletepage() {
     return;
   }

   // 유저 대시보드
  @UseGuards(JWTAuthGuard)
  @Get('users_h/userDashboard')
  @Render('userDashboard')
  async userTotal() {
    //가입한 그룹목록(테스트 목적, 전체 그룹 조회)
    const groups = await this.groupsService.findAllGroups();
    return {
      groups : groups
    };
  }



}
