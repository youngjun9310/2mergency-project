import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'records'
})

export class Records {
    
    @PrimaryGeneratedColumn()
    recordId : number;

    // 시작 시간
    @Column({ type : 'time', nullable : true })
    startTime : Date;

    // 도착 시간
    @Column({ type : 'time', nullable : true })
    endTime : Date;

    @Column({ type : 'bigint', nullable : false, default : 0 })
    stackedDistance : bigint;

    @ManyToOne(() => Users, (users) => users.records, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'int', name : 'userId', nullable : false })
    userId : number;

}
