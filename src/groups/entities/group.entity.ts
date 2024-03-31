import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../types/Category.type";
import { Users } from "src/users/entities/user.entity";
import { GroupMembers } from "src/group-members/entities/group-member.entity";
import { Schedules } from "src/schedules/entities/schedule.entity";

@Entity({
    name : 'groups'
})
export class Groups {

    @PrimaryGeneratedColumn()
    groupId : number; 

    @Column({ type : 'varchar', nullable : false })
    title : string;

    @Column({ type : 'text', nullable : false })
    content : string;

    @Column({ type : 'enum', enum: Category, nullable : false })
    category : Category;

    @Column({ type : 'boolean', nullable : false, default : true })
    isPublic : boolean;

    @CreateDateColumn({ type : 'timestamp' })
    createdAt : Date;
    
    @UpdateDateColumn({ type : 'timestamp' })
    updatedAt : Date;
    

    @ManyToOne(() => Users)
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'int', nullable : false })
    userId : number;

    @OneToMany(() => Schedules, (schedules) => schedules.groups)
    schedules : Schedules[];

    @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.groups)
    groupMembers : GroupMembers[];

    
}
