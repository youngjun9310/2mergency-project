import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { ScheduleMembers } from 'src/schedule-members/entities/schedule-member.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ScheduleMembers)
    private scheduleMembersRepository: Repository<ScheduleMembers>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    @InjectRepository(Groups)
    private groupsRepository: Repository<Groups>,
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  /** 전체적으로 다시 수정해야 하거나 생각해봐야 하는 것: group안에 있는 스케쥴임....**/
  // 스케쥴 등록
  async createSchedule(
    createScheduleDto: ScheduleDto,
    groupId: number,
    userId: number,
  ) {
    const { title, content, category, scheduleDate } = createScheduleDto;

    const group = await this.groupsRepository.findOne({
      where: { groupId },
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const newSchedule = await this.schedulesRepository.save({
      groupId,
      userId,
      title,
      content,
      category,
      scheduleDate,
    });

    // 스케쥴을 등록하면 등록한 사람이 scheduleMemberRepository에 생성이 되어야한다.
    await this.scheduleMembersRepository.save({
      scheduleId: newSchedule.scheduleId,
      userId,
      groupId,
    });

    return newSchedule;
  }

  // 스케쥴 전체 조회
  /** 클라이언트가 url에 접근하면 자동적으로 싹 보여줌... 그럼 파라미터는 없어도 되는 거 아닌가?**/
  async getAllSchedule(groupId: number) {
    const allSchedule = await this.schedulesRepository.find({
      where: { groupId },
    });

    if (allSchedule.length === 0) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    return allSchedule;
  }

  // 스케쥴 상세 조회
  async getOneSchedule(groupId: number, scheduleId: number, userId: number) {
    console.log('user : ', userId);
    console.log('groupId : ', groupId);
    console.log('scheduleId : ', scheduleId);
    const selectUser = await this.groupMembersRepository.findOne({
      where: { groups: { groupId }, userId },
    });

    // if (userId !== selectUser.users.userId) {
    //   throw {
    //     status: HttpStatus.UNAUTHORIZED,
    //   };
    // }

    const schedule = await this.scheduleRepository.findOne({
      where: { groups: { groupId }, userId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    return schedule;
  }

  // 스케쥴 수정
  async changeSchedule(changeScheduleDto: ScheduleDto, scheduleId: number) {
    // 교체하고자 하는 스케쥴 1개를 찾아준다.
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    await this.schedulesRepository.update(scheduleId, changeScheduleDto);

    return schedule;
  }

  // 스케쥴 삭제
  async deleteSchedule(scheduleId: number) {
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    await this.schedulesRepository.delete({ scheduleId });

    return {
      status: HttpStatus.OK,
    };
  }
}
