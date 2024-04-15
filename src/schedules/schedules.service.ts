import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private scheduleRepository: Repository<Schedules>,
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

    const newSchedule = await this.scheduleRepository.save({
      groupId,
      userId,
      title,
      content,
      category,
      scheduleDate,
    });

    return newSchedule;
  }

  // 스케쥴 전체 조회
  /** 클라이언트가 url에 접근하면 자동적으로 싹 보여줌... 그럼 파라미터는 없어도 되는 거 아닌가?**/
  async getAllSchedule(groupId: number) {
    const allSchedule = await this.scheduleRepository.find({
      where: { groupId },
    });

    if (!allSchedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    return allSchedule;
  }

  // 스케쥴 상세 조회
  async getOneSchedule(groupId: number, scheduleId: number, userId: number) {
    const selectUser = await this.groupMembersRepository.findOne({
      where: { groupId, userId },
    });

    if (userId !== selectUser.userId) {
      throw {
        status: HttpStatus.UNAUTHORIZED,
      };
    }

    const schedule = await this.scheduleRepository.findOne({
      where: { groupId, scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    return schedule;
  }

  // 스케쥴 수정
  async changeSchedule(
    changeScheduleDto: ScheduleDto,
    scheduleId: number,
    // userId: number,
  ) {
    // 교체하고자 하는 스케쥴 1개를 찾아준다.
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId },
    });

    // if (!userId) {
    //   throw {
    //     status: HttpStatus.UNAUTHORIZED,
    //   };
    // }
    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    await this.scheduleRepository.update(scheduleId, changeScheduleDto);

    return {
      status: HttpStatus.OK,
    };
  }

  // 스케쥴 삭제
  async deleteSchedule(scheduleId: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    await this.scheduleRepository.delete({ scheduleId });

    return {
      status: HttpStatus.OK,
    };
  }
}
