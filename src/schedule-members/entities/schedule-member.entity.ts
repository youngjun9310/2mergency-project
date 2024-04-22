import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { Users } from 'src/users/entities/user.entity';
import { Groups } from 'src/groups/entities/group.entity';

@Entity({
  name: 'scheduleMembers',
})
export class ScheduleMembers {
  @PrimaryGeneratedColumn()
  scheduleMemberId: number; // 스케줄 멤버의 고유 ID(scheduleMembers 테이블의 기본 키!)

  @ManyToOne(() => Schedules, (schedules) => schedules.scheduleMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'scheduleId' })
  schedules: Schedules; // 스케줄 엔티티와의 관계

  @Column({ type: 'int', name: 'scheduleId', nullable: false })
  scheduleId: number;

  @ManyToOne(() => Groups, (groups) => groups.scheduleMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
  groups: Groups; // 그룹 엔티티와의 관계

  @Column({ type: 'int', name: 'groupId', nullable: false })
  groupId: number;

  @ManyToOne(() => Users, (users) => users.scheduleMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  users: Users; // 사용자 엔티티와의 관계

  @Column({ type: 'int', name: 'userId', nullable: false })
  userId: number;
}
