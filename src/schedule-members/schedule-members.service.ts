import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleMembers } from './entities/schedule-member.entity'; // 가정: ScheduleMembers 엔티티 경로
import { Repository } from 'typeorm';
import { Groups } from 'src/groups/entities/group.entity';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/entities/user.entity';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';

@Injectable()
export class ScheduleMembersService {
  constructor(
    @InjectRepository(ScheduleMembers)
    private scheduleMembersRepository: Repository<ScheduleMembers>,
    private groupMembersService: GroupMembersService,
    @InjectRepository(Groups)
    private groupsRepository: Repository<Groups>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private usersService: UsersService,
    @InjectRepository(GroupMembers)
    private groupMembersRepository: Repository<GroupMembers>,
  ) {}

  /**
   * 스케줄에 멤버 등록
   */

  async registerScheduleMember(groupId: number, scheduleId: number, email: string) {
    // 그룹이 있는지 먼저 확인하기
    const isGroup = await this.groupsRepository.findOne({ where: { groupId } });
    if (!isGroup) {
      throw new NotFoundException(`해당하는 그룹이 존재하지 않습니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`${user.userId}유저가가 존재하지 않습니다.`);
    }

    // 그룹 멤버인지 확인 및 초대 수락 여부 확인
    const isGroupMember = await this.groupMembersRepository.findOne({
      where: {
        groupId: groupId,
        userId: user.userId,
      },
      select: ['userId', 'isVailed'],
    });

    if (!isGroupMember) {
      throw new BadRequestException(`${user.userId}사용자는 ${groupId}그룹의 멤버가 아닙니다.`);
    }

    if (!isGroupMember.isVailed) {
      throw new BadRequestException(`${user.userId} 사용자는 ${groupId} 그룹의 초대를 아직 수락하지 않았습니다.`);
    }

    // 스케줄이 있는지 확인하기
    const isSchedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groups: { groupId } },
    });
    if (!isSchedule) {
      throw new NotFoundException(`그룹${groupId}에서 해당 스케줄${scheduleId}은 존재하지 않습니다.`);
    }

    // 해당 스케줄에 사용자가 이미 등록되어 있는지 확인
    const existingScheduleMember = await this.scheduleMembersRepository.findOne({
      where: { scheduleId: scheduleId, userId: user.userId },
    });

    if (existingScheduleMember) {
      throw new BadRequestException(`${user.userId}사용자는 이미 ${scheduleId}스케줄에 등록되어 있습니다.`);
    }

    // 스케줄 멤버를 생성하고 저장
    const newScheduleMember = await this.scheduleMembersRepository.create({
      groupId,
      scheduleId,
      userId: user.userId,
    });

    await this.scheduleMembersRepository.save(newScheduleMember);

    // 성공적으로 저장된다면 -> 성공 메세지 반환
    return {
      success: true,
      message: `${groupId}그룹의 ${scheduleId}스케줄에 ${user.userId}멤버 등록이 완료되었습니다.`,
      newScheduleMember,
    };
  }

  /**
   * 스케줄에 등록된 멤버 전체 조회
   **/
  async findAllScheduleMembers(groupId: number, scheduleId: number) {
    // 스케줄 멤버 조회
    const schedule = await this.schedulesRepository.find({
      where: { scheduleId, groups: { groupId } },
      relations: ['scheduleMembers', 'scheduleMembers.users'], // 필요하다면 사용자 정보도 같이 로드
    });

    if (!schedule) {
      throw new NotFoundException(`해당 그룹 ${groupId}에서 스케줄 ${scheduleId}는 존재하지 않습니다.`);
    }
    return schedule;
  }

  /**
   * 스케줄에 등록된 멤버 상세 조회
   **/
  async findOneScheduleMembers(
    groupId: number,
    scheduleId: number,
    userId: number,
  ): Promise<ScheduleMembers | undefined> {
    // 스케줄이 해당 그룹에 속하는지 확인
    const schedule = await this.schedulesRepository.findOne({
      where: {
        scheduleId,
        groups: { groupId },
      },
    });
    // 스케줄 없으면 오류 반환
    if (!schedule) {
      throw new NotFoundException('그룹에 해당 스케줄이 없습니다.');
    }
    // 스케줄이 있으면 => 등록된 멤버를 userId로 조회
    return await this.scheduleMembersRepository.findOne({
      where: { schedules: { scheduleId }, users: { userId } },
    });
  }

  async deleteScheduleMembers(groupId: number, scheduleId: number, email: string): Promise<void> {
    // 해당 스케줄이 -> 그룹에 속해있는지 확인
    const schedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groups: { groupId } },
    });

    if (!schedule) {
      throw new NotFoundException(`${groupId}그룹에 해당하는 ${scheduleId}스케줄이 없습니다.`);
    }

    // 사용자가 있는지 이메일로 확인
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`${user.userId}유저가가 존재하지 않습니다.`);
    }

    // 해당 스케줄에 등록된 멤버가 있는지 확인
    const member = await this.scheduleMembersRepository.findOne({
      where: { scheduleId: scheduleId, userId: user.userId },
    });

    if (!member) {
      throw new NotFoundException(`해당 ${user.userId}멤버는 그룹 스케줄에 등록된 유저가 아닙니다.`);
    }
    // 멤버 삭제하기
    await this.scheduleMembersRepository.delete({
      scheduleId: scheduleId,
      userId: user.userId,
    });
  }
}
