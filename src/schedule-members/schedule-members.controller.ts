import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleMembersService } from './schedule-members.service';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';

@Controller('schedule-members')
export class ScheduleMembersController {
  constructor(
    private readonly scheduleMembersService: ScheduleMembersService,
  ) {}

  @Post()
  create(@Body() createScheduleMemberDto: CreateScheduleMemberDto) {
    return this.scheduleMembersService.create(createScheduleMemberDto);
  }

  @Get()
  findAll() {
    return this.scheduleMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleMembersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleMemberDto: UpdateScheduleMemberDto,
  ) {
    return this.scheduleMembersService.update(+id, updateScheduleMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleMembersService.remove(+id);
  }
}
