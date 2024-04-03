import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "src/users/entities/user.entity";
import { Groups } from "src/groups/entities/group.entity";
import { MemberRole } from "../types/groupMemberRole.type";

@Entity({
    name : 'groupMembers'
})

export class GroupMembers {
    
    @PrimaryGeneratedColumn()
    groupMemberId : number;

    @Column({ type : 'enum', enum: MemberRole , nullable : false, default : MemberRole.User })
    memberRole : MemberRole;

    @Column({ type : 'boolean', nullable : false, default : false })
    isVailed : boolean;


    // @ManyToOne(() => Users, (users) => users.groupMembers, {
    //     onDelete : 'CASCADE'
    // })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'varchar' })
    userId : string;

    @ManyToOne(() => Groups, (groups) => groups.groupMembers, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'groupId', referencedColumnName : 'groupId' })
    groups : Groups;
    
    @Column({ type : 'int' })
    groupId : number;

    
}
