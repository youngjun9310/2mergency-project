import { Groups } from 'src/groups/entities/group.entity';
import { ScheduleMembers } from 'src/schedule-members/entities/schedule-member.entity';
import { Category } from 'src/types/Category.type';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'schedules',
})
export class Schedules {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'date', nullable: false })
  scheduleDate: Date;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date' })
  updatedAt: Date;

  @ManyToOne(() => Groups, (groups) => groups.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
  groups: Groups;

  @Column({ type: 'int', name: 'groupId', nullable: false })
  groupId: number;

  @ManyToOne(() => Users, (users) => users.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'userId',
  })
  users: Users;

  @Column({ type: 'int', name: 'userId', nullable: false })
  userId: number;

  @OneToMany(
    () => ScheduleMembers,
    (scheduleMembers) => scheduleMembers.schedules,
  )
  scheduleMembers: ScheduleMembers[];
}
