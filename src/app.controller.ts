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
  constructor(private readonly appService: AppService) {}
  @Get('/')
  @Render('index')
  root() {
    return { message: 'data' };
  }

  

  
  

  

  

  

  

  

  

}
