import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleMembers } from './entities/schedule-member.entity'; // 가정: ScheduleMembers 엔티티 경로
import { Repository } from 'typeorm';
import { CreateScheduleMemberDto } from './dto/create-schedule-member.dto';
import { UpdateScheduleMemberDto } from './dto/update-schedule-member.dto';
import { Groups } from 'src/groups/entities/group.entity';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { GroupMembersService } from 'src/group-members/group-members.service';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';

@Injectable()
export class ScheduleMembersService {
  constructor(
    @InjectRepository(ScheduleMembers)
    private scheduleMemberRepository: Repository<ScheduleMembers>,
    private groupMembersService: GroupMembersService,
    @InjectRepository(Groups)
    private groupsRepository: Repository<Groups>,
    @InjectRepository(Schedules)
    private schedulesRepository: Repository<Schedules>,
  ) {}

  /**
   * 스케줄에 멤버 등록
   * @returns
   */

  async registerScheduleMember(
    groupId: number,
    scheduleId: number,
    userId: number,
  ): Promise<any> {
    // 그룹이 있는지 먼저 확인하기
    const isGroup = await this.groupsRepository.findOne({ where: { groupId } });
    if (!isGroup) {
      throw new NotFoundException(`해당하는 그룹이 존재하지 않습니다.`);
    }

    // 그룹 멤버인지 확인!
    const isGroupMember = await this.groupMembersService.isGroupMember(
      groupId,
      userId,
    );

    if (!isGroupMember) {
      throw new BadRequestException('이 그룹의 멤버가 아닙니다.');
    }

    // 스케줄이 있는지 확인하기
    const isSchedule = await this.schedulesRepository.findOne({
      where: { scheduleId, groupId },
    });
    if (!isSchedule) {
      throw new NotFoundException(`그룹에서 해당 스케줄은 존재하지 않습니다.`);
    }

    // 스케줄 멤버를 생성하고 저장
    const newScheduleMember = this.scheduleMemberRepository.create({
      scheduleId,
      userId,
    });

    // 생성된 스케줄 멤버를 데이터베이스에 저장
    await this.scheduleMemberRepository.save(newScheduleMember);

    // 성공적으로 저장된다면 -> 성공 메세지 반환
    return {
      success: true,
      message: '스케줄 멤버가 성공적으로 등록되었습니다.',
      data: newScheduleMember,
    };
  }

  findAll() {
    return `This action returns all scheduleMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} scheduleMember`;
  }

  update(id: number, updateScheduleMemberDto: UpdateScheduleMemberDto) {
    return `This action updates a #${id} scheduleMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} scheduleMember`;
  }
}
