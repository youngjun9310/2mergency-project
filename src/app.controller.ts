import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from './auth/decorator/userInfo.decorator';
import { Users } from './users/entities/user.entity';

@ApiTags('Handlebars(HBS)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  @Render('index')
  root() {
    return { message: 'data' };
  }

  @Get('/welcomepage')
  @Render('welcomepage')
  welcomepage() {
    return { message: 'data' };
  }

  @Get('/users_h/userDashboard')
  @Render('userDashboard')
  mainpage(@UserInfo() users : Users) {
    return {
      users : users
    };
  }
}
