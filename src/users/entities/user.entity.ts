import { Follows } from "src/follows/entities/follow.entity";
import { GroupMembers } from "src/group-members/entities/group-member.entity";
import { Groups } from "src/groups/entities/group.entity";
import { PostComments } from "src/post-comments/entities/post-comment.entity";
import { Posts } from "src/posts/entities/posts.entity";
import { Records } from "src/records/entities/record.entity";
import { ScheduleMembers } from "src/schedule-members/entities/schedule-member.entity";
import { Schedules } from "src/schedules/entities/schedule.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
    name : 'users'
})

export class Users {
    
    @PrimaryGeneratedColumn()
    userId : number;

    @Column({ type : 'varchar', nullable : false, unique : true })
    nickname : string;

    @Column({ type : 'varchar', nullable : false, unique : true })
    email : string;

    @Column({ type : 'varchar', nullable : false })
    password : string;

    @Column({ type : 'varchar', nullable : false })
    address : string;

    @Column({ type : 'bigint', nullable : true, default : 1000 })
    point : bigint;

    @Column({ type : 'varchar', nullable : true })
    profileImage? : string;

    @Column({ type : 'boolean', nullable : false, default : false })
    isDelete? : boolean;

    @Column({ type : 'boolean', nullable : false, default : false })
    isAdmin : boolean;

    @Column({ type : 'boolean', nullable : false, default : true })
    isOpen : boolean;

    @CreateDateColumn({ type : 'timestamp', nullable : false })
    createdAt : Date;

    @UpdateDateColumn({ type : 'timestamp', nullable : false })
    updatedAt : Date;

    @DeleteDateColumn({ type : 'timestamp', nullable : true })
    deletedAt? : Date;


    @OneToMany(() => Posts , (posts) => posts.users)
    posts : Posts[];

    @OneToMany(() => PostComments, (postComments) => postComments.users)
    postComments : PostComments[];

    @OneToMany(() => Groups, (groups) => groups.users)
    groups : Groups[];

    @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.users)
    groupMembers : GroupMembers[];

    @OneToMany(() => Records, (records) => records.users)
    records : Records[];

    @OneToMany(() => Follows, (follows) => follows.users)
    follows : Follows[];

    @OneToMany(() => Schedules, (schedules) => schedules.users)
    schedules : Schedules[];

    @OneToMany(() => ScheduleMembers, (scheduleMembers) => scheduleMembers.users)
    scheduleMembers : ScheduleMembers[];

    
}
