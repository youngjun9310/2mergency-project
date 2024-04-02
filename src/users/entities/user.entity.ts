import { GroupMembers } from "src/group-members/entities/group-member.entity";
import { Records } from "src/records/entities/record.entity";
import { ScheduleMembers } from "src/schedule-members/entities/schedule-member.entity";
import { Schedules } from "src/schedules/entities/schedule.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({
    name : 'users'
})

export class Users {
    
    @PrimaryGeneratedColumn('uuid')
    userId : string;

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

    @OneToMany(() => GroupMembers, (groupMembers) => groupMembers.users, { cascade : true })
    groupMembers : GroupMembers[];

    @OneToMany(() => Records, (records) => records.users, { cascade : true })
    records : Records[];

    @OneToMany(() => Schedules, (schedules) => schedules.users, { cascade : true })
    schedules : Schedules[];

    @OneToMany(() => ScheduleMembers, (scheduleMembers) => scheduleMembers.users, { cascade : true })
    scheduleMembers : ScheduleMembers[];

    
}
