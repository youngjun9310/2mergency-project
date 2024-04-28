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
import { RecordsService } from 'src/records/records.service';


@UseGuards(JWTAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    private readonly recordsService: RecordsService,

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
  @Post('/userUpdate')
  @Redirect('/')
  async userUpdate( @UserInfo() users: Users,@Body() updateDto: UpdateDto,@UploadedFile() file: Express.Multer.File,groupId : number
) {
  
  console.log('groupId', groupId)
 
  const groups = await this.usersService.findGroupId(groupId);
  console.log('groups', groups)

  await this.usersService.userUpdate(users.userId, updateDto, file);

  return {
    users : users,
    groups : groups,
    url: '/users/users_h/usermypage'
  };
  }

  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @ApiBearerAuth('access-token')
  @Delete('')
  //@Redirect('/user_h/welcomePage')
  async userDelete(@Body() deleteDto: DeleteDto, @UserInfo() users: Users, @Res() res: Response) {

    try {
      await this.usersService.userDelete(users.userId, deleteDto.password);
      res.redirect('/auth/users_h/welcomePage');
    } catch (error) {
      const message = error.response.message
      console.log(message)

      res.redirect('/users/users_h/userDelete');
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
  @UseGuards(RolesGuard)
  @Get('users_h/userall')
  @Render('userall')
  async findall() {
    const users = await this.usersService.findAllUser();
    return {
      user : users
    };
  }

  // 유저 마이 정보 조회 겸 대시보드
  @Get('/users_h/usermypage')
  @Render('usermypage')
  async users( @UserInfo() users : Users ) {
    const records = await this.recordsService.findAll(users.userId);
    console.log('records', records)

    return {
      user : users,
      records : records.record
    };
    
  }

  // 유저 정보 수정
  @Get('users_h/userEdit')
  @Render('userEdit')
  async userEditpage(@UserInfo() users : Users, groupId : number) {
    const groups = await this.usersService.findGroupId(groupId);
    return {
      users : users,
      groups : groups
    };
  }

   // 유저 회원 탈퇴
   @Get('/users_h/userDelete')
   @Render('userDelete')
   async userDeletepage(@UserInfo() users : Users, groupId : number) {
    const groups = await this.usersService.findGroupId(groupId);
    return{
      users : users,
      groups : groups
    };
  }


   // 커뮤니티 메인화면
  @Get('users_h/userDashboard')
  @Render('userDashboard')
  async userTotal(@UserInfo() users : Users, groupId : number) {
    //전체 그룹목록
    const groups = await this.usersService.findGroupId(groupId);
    return {
      user : users,
      groups : groups
    };
  }
  
}
