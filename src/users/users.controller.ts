import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Render,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    private readonly recordsService: RecordsService,

  ) {}
  

  /** 전체 사용자 조회(어드민용)*/
  @ApiOperation({ summary: '전체 사용자 조회 API', description: '사용자 전체 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 전체 사용자 조회를 완료했습니다.' })
  @UseGuards(JWTAuthGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @Get('allUser')
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  /** 사용자 조회*/
  @ApiOperation({ summary: '사용자 조회 API', description: '사용자 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 조회하였습니다.' })
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('/')
  async findUser(@UserInfo() users: Users) {
    return await this.usersService.findUser(users.userId);
  }
  
  /** 사용자 수정*/
  @ApiOperation({ summary: '사용자 정보 수정 API', description: '사용자 정보 수정 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 수정하였습니다.' })
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiBearerAuth('access-token')
  @Post('/userUpdate')
  @Redirect('/')
  async userUpdate( @UserInfo() users: Users,@Body() updateDto: UpdateDto,@UploadedFile() file: Express.Multer.File,groupId : number) {
    const groups = await this.usersService.findGroupId(groupId);
    await this.usersService.userUpdate(users.userId, updateDto, file);
    return {
      users : users,
      groups : groups,
      url: '/users/users_h/usermypage'
    };
  }


  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제 API', description: '사용자 삭제 성공' })
  @ApiResponse({ status: 204, description: '성공적으로 사용자를 삭제 하였습니다.' })
  @UseGuards(JWTAuthGuard)
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
  @ApiOperation({ summary: '사용자 접속정보조회 API', description: ' 사용자 접속정보조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자의 접송 정보를 조회하였습니다.' })
  @UseGuards(JWTAuthGuard)
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
      user: users,
    };
  }

  // 유저 메인화면
  @UseGuards(JWTAuthGuard)
  @Get('/users_h/usermypage')
  @Render('usermypage')
  async users( @UserInfo() users : Users ) {
    const records = await this.recordsService.findAll(users.userId);
    return {
      user : users,
      records : records.record
    };
    
  }

  // 유저 정보 수정
  @UseGuards(JWTAuthGuard)
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
   @UseGuards(JWTAuthGuard)
   @Get('/users_h/userDelete')
   @Render('userDelete')
   async userDeletepage(@UserInfo() users : Users, groupId : number) {
    const groups = await this.usersService.findGroupId(groupId);
    return{
      users : users,
      groups : groups
    };
  }


   // 커뮤니티 메인화면(로그인함)
  @UseGuards(JWTAuthGuard)
  @Get('users_h/userDashboard')
  @Render('userDashboard')
  async userTotalLogin(@UserInfo() users : Users, groupId : number) {
    //전체 그룹목록
    const groups = await this.groupsService.findAllGroups();
    const records = await this.recordsService.recordall();
    
    return {
      user : users,
      groups : groups,
      records : records.record
    };
  }

  
}
