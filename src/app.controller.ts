import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { GroupsService } from './groups/groups.service';
import { RecordsService } from './records/records.service';

@ApiTags('Handlebars(HBS)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly groupsService : GroupsService,
    private readonly recordservice : RecordsService
  ) {}
  @Get('/')
  @Render('welcomePage')
  root() {
    return { message: 'data' };
  }

  @Get('/Dashboard')
  @Render('Dashboard')
  async Dashboard() {
    const groups = await this.groupsService.findAllGroups();
    const records = await this.recordservice.recordall();
    return { 
      groups : groups,
      records : records.record
     };
  }
}
