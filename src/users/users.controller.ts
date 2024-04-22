import { Controller, Get, Body, Patch, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserInfo } from '../auth/decorator/userInfo.decorator';
import { Users } from './entities/user.entity';
import { UpdateDto } from './dto/update.dto';
import { DeleteDto } from './dto/delete.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JWTAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
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
  async findUser(@UserInfo() users: Users) {
    return await this.usersService.findUser(users.userId);
  }
  /** 사용자 수정*/
  @ApiOperation({ summary: '사용자 정보수정', description: '수정' })
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiBearerAuth('access-token')
  @Patch('')
  async userUpdate(@Body() updateDto: UpdateDto, @UploadedFile() file: Express.Multer.File, @UserInfo() users: Users) {
    return await this.usersService.userUpdate(users.userId, updateDto, file);
  }
  /** 사용자 삭제*/
  @ApiOperation({ summary: '사용자 삭제', description: '삭제' })
  @ApiBearerAuth('access-token')
  @Delete('')
  async userDelete(@Body() deleteDto: DeleteDto, @UserInfo() users: Users) {
    return await this.usersService.userDelete(users.userId, deleteDto.password);
  }
  /** 사용자 접속정보조회*/
  @ApiOperation({ summary: '사용자 접속정보조회', description: '접속정보조회' })
  @ApiBearerAuth('access-token')
  @Get('info')
  async getUserInfo(@UserInfo() users: Users) {
    return await this.usersService.findByEmail(users.email);
  }
}
