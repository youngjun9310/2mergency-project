import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/create-schedule.dto';
import { UserInfo } from 'src/auth/decorator/userInfo.decorator';
import { Users } from 'src/users/entities/user.entity';
import { MemberRole } from 'src/group-members/types/groupMemberRole.type';
import { memberRolesGuard } from 'src/group-members/guard/members.guard';
import { JWTAuthGuard } from 'src/auth/guard/jwt.guard';
import { MemberRoles } from 'src/group-members/decorator/memberRoles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@UseGuards(JWTAuthGuard)
@ApiTags('Schedules')
@Controller('groups/:groupId/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  // 스케쥴 생성
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Post('')
  @ApiOperation({ summary: '스케줄 생성 API', description: '스케줄 생성 성공' })
  @ApiResponse({ status: 201, description: '성공적으로 스케줄을 생성 하였습니다.' })
  async createSchedule(
    @Body() createScheduleDto: ScheduleDto,
    @UserInfo() users: Users,
    @Param('groupId') groupId: number,
    @Res() res: Response,
  ) {
    try {
      await this.schedulesService.createSchedule(createScheduleDto, groupId, users.userId);

      res.status(201).send(`
      <script>
        alert("스케줄 생성이 완료되었습니다.");
        window.location.href = '/groups/${groupId}/schedules/schedules_h/scheduleAll';
      </script>
    `);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'ExpiredSession') {
        res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if(errorMsg === "Unauthorized"){
        res.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  // 스케쥴 전체 조회
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @ApiBearerAuth('access-token')
  @Get('')
  @ApiOperation({ summary: '스케줄 전체 조회 API', description: '스케줄 전체 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 스케줄 전체 조회를 완료했습니다.' })
  async getAllSchedule(@Param('groupId') groupId: number, @Res() res: Response) {
    try {
      await this.schedulesService.getAllSchedule(groupId);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'NotScheduleError') {
        res.status(404).send(`
        <script>
            alert("스케줄이 존재하지 않습니다.");
            window.location.href = '/groups/${groupId}/groups_h/groupList';
        </script>
        `);
      } else if (error) {
        const errorMsg = error.message;

        if (errorMsg === 'ExpiredSession') {
          res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
        }
      } else if(errorMsg === "Unauthorized"){
        res.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  // 스케쥴 상세 조회
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @ApiBearerAuth('access-token')
  @Get('/:scheduleId')
  @ApiOperation({ summary: '스케줄 상세 조회 API', description: '스케줄 상세 조회 성공' })
  @ApiResponse({ status: 200, description: '성공적으로 스케줄 상세 조회를 완료했습니다.' })
  async getOneSchedule(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @UserInfo() users: Users,
    @Res() res: Response,
  ) {
    try {
      await this.schedulesService.getOneSchedule(groupId, scheduleId, users.userId);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'ExpiredSession') {
        res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if(errorMsg === "Unauthorized"){
        res.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  // 스케쥴 수정
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Patch('/:scheduleId')
  @ApiOperation({ summary: '스케줄 수정 API', description: '스케줄 수정 성공' })
  @ApiResponse({ status: 201, description: '성공적으로 스케줄을 수정 하였습니다.' })
  async changeSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() changeScheduleDto: ScheduleDto,
    @Res() res: Response,
    @Param('groupId') groupId : number
  ) {
    try {
      await this.schedulesService.changeSchedule(changeScheduleDto, scheduleId);

      return res.status(201).send(`
      <script>
          alert("스케줄 수정 완료");
          window.location.href = '/groups/${groupId}/schedules/schedules_h/scheduleAll;
      </script>
      `);

    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'ExpiredSession') {
        res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if(errorMsg === "Unauthorized"){
        res.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  // 스케쥴 삭제
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @ApiBearerAuth('access-token')
  @Delete('/:scheduleId')
  @ApiOperation({ summary: '스케줄 삭제 API', description: '스케줄 삭제 성공' })
  @ApiResponse({ status: 204, description: '성공적으로 스케줄을 삭제 하였습니다.' })
  async deleteSchedule(@Param('scheduleId') scheduleId: number, @Res() res: Response, @Param('groupId') groupId : number) {
    try {
      await this.schedulesService.deleteSchedule(scheduleId);

      res.status(204).send(`
      <script>
          alert("스케줄 삭제 완료");
          window.location.href = '/groups/${groupId}/schedules/schedules_h/scheduleAll;
      </script>
      `);
    } catch (error) {
      const errorMsg = error.message;

      if (errorMsg === 'ExpiredSession') {
        res.status(404).send(`
          <script>
            alert("해당 사용자가 존재하지 않습니다.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      } else if(errorMsg === "Unauthorized"){
        res.status(401).send(`
          <script>
            alert("로그인을 해주세요.");
            window.location.href = '/auth/users_h/login';
          </script>
        `);
      }
    }
  }

  /** hbs 양식 */
  // 스케줄 생성
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get('/schedules_h/schedulecreate')
  @Render('schedulecreate')
  async schedulescreate(@Param('groupId') groupId: number, @UserInfo() users: Users) {
    return {
      groupId: groupId,
      users: users,
    };
  }

  // 스케줄 전체 목록조회
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get('/schedules_h/scheduleall')
  @Render('scheduleall')
  async scheduleall(@Param('groupId') groupId: number, @UserInfo() users: Users) {
    const schedules = await this.schedulesService.getAllSchedule(groupId);
    return {
      schedules: schedules,
      groupId: groupId,
      users: users,
    };
  }

  // 스케줄 상세 목록조회
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main, MemberRole.User)
  @Get('/:scheduleId/schedules_h/schedulelist')
  @Render('schedulelist')
  async schedulelist(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @UserInfo() users: Users,
  ) {
    const schedules = await this.schedulesService.getScheduleId(groupId, scheduleId);
    return {
      schedules: schedules,
      groupId: groupId,
      users: users,
    };
  }

  // 스케줄 수정
  @UseGuards(memberRolesGuard)
  @MemberRoles(MemberRole.Admin, MemberRole.Main)
  @Get('/:scheduleId/schedules_h/scheduleEdit')
  @Render('scheduleEdit')
  async scheduleEdit(
    @Param('groupId') groupId: number,
    @Param('scheduleId') scheduleId: number,
    @UserInfo() users: Users,
  ) {
    const schedules = await this.schedulesService.getScheduleId(groupId, scheduleId);
    return {
      schedules: schedules,
      groupId: groupId,
      users: users,
    };
  }

  
}
