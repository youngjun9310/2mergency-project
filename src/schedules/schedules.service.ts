import { HttpStatus, Injectable } from '@nestjs/common';
import { ScheduleDto } from './dto/schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedules } from './entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private ScheduleRepository: Repository<Schedules>,
  ) {}
  /** 전체적으로 다시 수정해야 하거나 생각해봐야 하는 것: group안에 있는 스케쥴임....**/
  // 스케쥴 등록
  async createSchedule(
    createScheduleDto:ScheduleDto,
    groupId: number,
    userId: number,
  ) {
    const { title, content, category, scheduleDate } = createScheduleDto;

    // 매개변수로 받은 groupId로 그룹을 찾는다.
    const group = await this.ScheduleRepository.findOne({
      where: { groupId },
    });

    if (!group) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    await this.ScheduleRepository.save({
      groupId,
      userId,
      title,
      content,
      category,
      scheduleDate,
    });

    return {
      status: HttpStatus.CREATED,
    };
  }

  // 스케쥴 전체 조회
  /** 클라이언트가 url에 접근하면 자동적으로 싹 보여줌... 그럼 파라미터는 없어도 되는 거 아닌가?**/
  async getAllSchedule(groupId: number) {
    const allSchedule = await this.ScheduleRepository.find({
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
  async getOneSchedule(groupId: number, scheduleId: number) {
    const schedule = this.ScheduleRepository.findOne({
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
  async changeSchedule(changeScheduleDto: ScheduleDto, scheduleId: number) {
    // 교체하고자 하는 스케쥴 1개를 찾아준다.
    const schedule = await this.ScheduleRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    await this.ScheduleRepository.update(scheduleId, changeScheduleDto);

    return {
      status: HttpStatus.OK,
    };
  }

  // 스케쥴 삭제
  async deleteSchedule(scheduleId: number) {
    const schedule = await this.ScheduleRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    await this.ScheduleRepository.delete({ scheduleId });

    return {
      status: HttpStatus.OK,
    };
  }
}