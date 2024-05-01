import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ScheduleMembers } from "./entities/schedule-member.entity";
import { Repository } from "typeorm";
import { Groups } from "src/groups/entities/group.entity";
import { Schedules } from "src/schedules/entities/schedule.entity";
import { UsersService } from "src/users/users.service";
import { GroupMembers } from "src/group-members/entities/group-member.entity";

@Injectable()
export class ScheduleMembersService {
  constructor(
    @InjectRepository(ScheduleMembers)
    private scheduleMembersRepository: Repository<ScheduleMembers>,
    @InjectRepository(Groups)
    private groupsRepository: Repository<Groups>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    private usersService: UsersService,
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  /**
   * 스케줄에 멤버 등록
   */

  async registerScheduleMember(groupId: number, scheduleId: number, email: string) {
    const isGroup = await this.groupsRepository.findOne({ where: { groupId } });
    if (!isGroup) {
      throw new NotFoundException(`해당하는 그룹이 존재하지 않습니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저 입니다.`);
    }

    // 그룹 멤버인지 확인 및 초대 수락 여부 확인
    const isGroupMember = await this.groupMembersRepository.findOne({
      where: {
        groupId: groupId,
        userId: user.userId,
      },
      select: ["userId", "isVailed"],
    });

    if (!isGroupMember) {
      throw new BadRequestException(`${user.nickname} 님은(는) 그룹의 멤버가 아닙니다.`);
    }

    if (!isGroupMember.isVailed) {
      throw new BadRequestException(`${user.nickname} 님은(는) 초대를 수락하지 않았습니다.`);
    }

    // 스케줄이 있는지 확인하기
    const isSchedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groupId },
    });
    if (!isSchedule) {
      throw new NotFoundException(`존재하지 않는 스케쥴입니다.`);
    }

    // 해당 스케줄에 사용자가 이미 등록되어 있는지 확인
    const existingScheduleMember = await this.scheduleMembersRepository.findOne({
      where: { scheduleId: scheduleId, userId: user.userId },
    });

    if (existingScheduleMember) {
      throw new BadRequestException(`이미 등록되어 있는 멤버입니다.`);
    }

    // 스케줄 멤버를 생성하고 저장
    const newScheduleMember = await this.scheduleMembersRepository.create({
      groupId,
      scheduleId,
      userId: user.userId,
    });

    await this.scheduleMembersRepository.save(newScheduleMember);

    return {
      statusCode: 200,
      message: `멤버 등록이 완료되었습니다.`,
    };
  }

  /**
   * 스케줄에 등록된 멤버 전체 조회
   **/
  async findAllScheduleMembers(groupId: number, scheduleId: number) {
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groupId },
      relations: ["scheduleMembers", "scheduleMembers.users"], // 필요하다면 사용자 정보도 같이 로드
    });

    if (!schedule) {
      throw new NotFoundException(`존재하지 않는 스케쥴입니다.`);
    }

    const findAllScheduleMembers = await this.scheduleMembersRepository.find({
      where: { groupId, scheduleId },
    });
    return findAllScheduleMembers;
  }

  /**
   * 스케줄에 등록된 멤버 상세 조회
   **/
  async findOneScheduleMembers(groupId: number, scheduleId: number, userId: number) {
    // 스케줄이 해당 그룹에 속하는지 확인
    const schedule = await this.schedulesRepository.findOne({
      where: {
        scheduleId,
        groups: { groupId },
      },
    });

    if (!schedule) {
      throw new NotFoundException("존재하지 않는 스케쥴입니다.");
    }
    // 스케줄이 있으면 => 등록된 멤버를 userId로 조회
    const findScheduleMember = await this.scheduleMembersRepository.findOne({
      where: { scheduleId, userId },
    });

    if (!findScheduleMember) {
      throw new NotFoundException("존재하지 않는 멤버입니다.");
    }
    return findScheduleMember;
  }

  // 스케쥴 멤버 삭제
  async deleteScheduleMembers(groupId: number, scheduleId: number, email: string) {
    // 해당 스케줄이 -> 그룹에 속해있는지 확인
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groups: { groupId } },
    });

    if (!schedule) {
      throw new NotFoundException(`스케쥴이 존재하지 않습니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저입니다.`);
    }

    // 해당 스케줄에 등록된 멤버가 있는지 확인
    const member = await this.scheduleMembersRepository.findOne({
      where: { scheduleId: scheduleId, userId: user.userId },
    });

    if (!member) {
      throw new NotFoundException(`존재하지 않는 멤버입니다.`);
    }
    // 멤버 삭제하기
    await this.scheduleMembersRepository.delete({
      scheduleId: scheduleId,
      userId: user.userId,
    });
    return {
      statusCode: 200,
      message: "스케쥴 멤버 삭제에 성공했습니다.",
    };
  }
}
