import { Body, Controller, Param, Post } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  async create(
    @Body() createScheduleDto: ScheduleDto,
    @Param('groupId') groupId: number,
  ) {
    return await this.schedulesService.createSchedule(
      createScheduleDto,
      groupId,
    );
  }

  // @Get()
  // findAll() {
  //   return this.schedulesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.schedulesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateScheduleDto: UpdateScheduleDto,
  // ) {
  //   return this.schedulesService.update(+id, updateScheduleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schedulesService.remove(+id);
}
