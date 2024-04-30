import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../types/Category.type';
import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import { ScheduleMembers } from 'src/schedule-members/entities/schedule-member.entity';

@Entity({
  name: 'groups',
})
export class Groups {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @Column({ type: 'boolean', nullable: false, default: true })
  isPublic: boolean;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @OneToMany(() => Schedules, (schedules) => schedules.groups, {
    cascade: true,
  })
  schedules: Schedules[];

  @OneToMany(
    () => ScheduleMembers,
    (scheduleMembers) => scheduleMembers.groups,
    {
      cascade: true,
    },
  )
  scheduleMembers: ScheduleMembers[];

  @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.groups, {
    cascade: true,
  })
  groupMembers: GroupMembers[];
}
