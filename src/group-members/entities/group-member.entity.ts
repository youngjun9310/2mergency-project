import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../types/groupMemberRole.type";
import { Users } from "src/users/entities/user.entity";
import { Groups } from "src/groups/entities/group.entity";

@Entity({
    name : 'groupMembers'
})

export class GroupMembers {
    
    @PrimaryGeneratedColumn()
    groupMenberId : number;

    @Column({ type : 'enum', enum: Role , nullable : false, default : Role.User })
    role : Role;

    @Column({ type : 'boolean', nullable : false, default : false })
    isVailed : boolean;


    // @ManyToOne(() => Users, (users) => users.groupMembers, {
    //     onDelete : 'CASCADE'
    // })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'int', nullable : false })
    userId : number;

    @ManyToOne(() => Groups, (groups) => groups.groupMembers, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'groupId', referencedColumnName : 'groupId' })
    groups : Groups;
    
    @Column({ type : 'int', nullable : false })
    groupId : number;

    
}
