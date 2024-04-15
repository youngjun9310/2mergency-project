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

@Entity({
  name: 'groups',
  name: 'groups',
})
export class Groups {
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;
  @PrimaryGeneratedColumn()
  groupId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;
  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;
  @Column({ type: 'enum', enum: Category, nullable: false })
  category: Category;

  @Column({ type: 'boolean', nullable: false, default: true })
  isPublic: boolean;
  @Column({ type: 'boolean', nullable: false, default: true })
  isPublic: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Schedules, (schedules) => schedules.groups, {
    cascade: true,
  })
  schedules: Schedules[];
  @OneToMany(() => Schedules, (schedules) => schedules.groups, {
    cascade: true,
  })
  schedules: Schedules[];

  @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.groups, {
    cascade: true,
  })
  groupMembers: GroupMembers[];
}
