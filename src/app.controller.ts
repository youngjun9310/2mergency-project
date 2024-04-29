import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { UserInfo } from './auth/decorator/userInfo.decorator';
import { Users } from './users/entities/user.entity';
import { GroupsService } from './groups/groups.service';
import { RecordsService } from './records/records.service';

@ApiTags('Handlebars(HBS)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly groupsService: GroupsService,
    private readonly recordsService: RecordsService,) {}
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
  async mainpage() {
    const groups = await this.groupsService.findAllGroups();
      const records = await this.recordsService.recordall();
    return {
      groups : groups,
      records : records.record
    };
  }
}
