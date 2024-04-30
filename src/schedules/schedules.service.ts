import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { ScheduleDto } from "./dto/create-schedule.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Schedules } from "./entities/schedule.entity";
import { Repository } from "typeorm";
import { Groups } from "src/groups/entities/group.entity";
import { GroupMembers } from "src/group-members/entities/group-member.entity";
import { ScheduleMembers } from "src/schedule-members/entities/schedule-member.entity";

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

  // 스케쥴 등록
  async createSchedule(createScheduleDto: ScheduleDto, groupId: number, userId: number) {
    const { title, content, category, scheduleDate } = createScheduleDto;

    if (!userId) {
      throw new HttpException("User not found", HttpStatus.UNAUTHORIZED);
    }

    const group = await this.groupsRepository.findOne({
      where: { groupId },
    });

    if (!group) {
      throw new HttpException("그룹을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
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

    return { statusCode: 201, message: "스케쥴을 생성했습니다." };
  }

  // 스케쥴 전체 조회

  async getAllSchedule(groupId: number) {
    const allSchedule = await this.schedulesRepository.find({
      where: { groupId },
    });

    if (allSchedule === null) {
      throw new NotFoundException("NotScheduleError");
    }

    return allSchedule;
  }

  // 스케쥴 상세 조회
  async getOneSchedule(groupId: number, scheduleId: number, userId: number) {
    const selectUser = await this.groupMembersRepository.findOne({
      where: { groups: { groupId }, userId },
    });

    if (!selectUser) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    const schedule = await this.schedulesRepository.findOne({
      where: { groupId, scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }
    return schedule;
  }

  async getScheduleId(groupId: number, scheduleId: number) {
    const schedule = await this.schedulesRepository.findOne({
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
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId },
    });

    if (!schedule) {
      throw {
        status: HttpStatus.NOT_FOUND,
      };
    }

    await this.schedulesRepository.update(scheduleId, changeScheduleDto);

    return { statausCode: 201, message: "스케쥴을 수정하였습니다." };
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
      statusCode: 201,
      message: "스케쥴을 삭제했습니다.",
    };
  }
}
