import { GroupMembers } from 'src/group-members/entities/group-member.entity';
import { Records } from 'src/records/entities/record.entity';
import { ScheduleMembers } from 'src/schedule-members/entities/schedule-member.entity';
import { Schedules } from 'src/schedules/entities/schedule.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', nullable: true })
  profileImage?: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  nickname: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isDelete?: boolean;

  @Column({ type: 'boolean', nullable: false, default: true })
  isOpen: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  CertificationStatus: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.users, {
    cascade: true,
  })
  groupMembers: GroupMembers[];

  @OneToMany(() => Records, (records) => records.users, { cascade: true })
  records: Records[];

  @OneToMany(() => Schedules, (schedules) => schedules.users, { cascade: true })
  schedules: Schedules[];

  @OneToMany(
    () => ScheduleMembers,
    (scheduleMembers) => scheduleMembers.users,
    { cascade: true },
  )
  scheduleMembers: ScheduleMembers[];

  //   @Column({
  //     type: 'enum',
  //     enum: MemberRole,
  //     default: MemberRole.User, // 기본값으로 MemberRole.User 설정
  //   })
  //   memberRole: MemberRole; // MemberRole 열거형을 사용하여 역할 정의
}
