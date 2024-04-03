import { Schedules } from "src/schedules/entities/schedule.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'scheduleMembers'
})

export class ScheduleMembers {
    
    @PrimaryGeneratedColumn()
    scheduleMemberId : number;

    @ManyToOne(() => Schedules, (schedules) => schedules.scheduleMembers, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'scheduleId', referencedColumnName : 'scheduleId' })
    schedules : Schedules;
    
    @Column({ type : 'int' })
    scheduleId : number;

    @ManyToOne(() => Users, (users) => users.scheduleMembers, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'int' })
    userId : number;
    
    
}
