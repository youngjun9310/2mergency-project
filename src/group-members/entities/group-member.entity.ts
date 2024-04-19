import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from '../types/groupMemberRole.type';
import { Users } from 'src/users/entities/user.entity';
import { Groups } from 'src/groups/entities/group.entity';

@Entity({
  name: 'groupMembers',
})
export class GroupMembers {
  @PrimaryGeneratedColumn()
  groupMemberId: number;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.User,
  })
  role: MemberRole;

  @Column({ type: 'boolean', nullable: false, default: false })
  isVailed: boolean;

  @ManyToOne(() => Users, (users) => users.groupMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  users: Users;

  @Column({ type: 'int', name: 'userId', nullable: false })
  userId: number;

  @ManyToOne(() => Groups, (groups) => groups.groupMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
  groups: Groups;

  @Column({ type: 'int', name: 'groupId', nullable: false })
  groupId: number;

  // 'isInvited' 초대가 발송된 상태 표시 => 초대된 상태면 isInvited=true
  @Column({ type: 'boolean', default: false })
  isInvited: boolean;
}
