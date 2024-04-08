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
      nullable: false,
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
  
    @Column({ type: 'int' })
    userId: number;
  
    @ManyToOne(() => Groups, (groups) => groups.groupMembers, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
    groups: Groups;
  
    @Column({ type: 'int' })
    groupId: number;
  
    // 'isInvited' 초대가 발송된 상태 표시 => 초대된 상태면 isInvited=true
    @Column({ type: 'boolean', default: false })
    isInvited: boolean;
  
    // hasAccepted 초대 수락 의미 -> 수락하면 hasAccepted = true
    // @Column({ type: 'boolean', default: false })
    // hasAccepted: boolean;
  
    // 1. isInvited=true,  hasAccepted=false 상태인 멤버 찾기
    // 2. hasAccepted=true로 업데이트하면? !=>  초대를 수락한 상태 !
  
    // 근데 isVailed 랑 hasAccepted 같은거 아닌감..?
  }
  