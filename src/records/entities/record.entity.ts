import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ type : 'decimal', nullable : false, default : 0 })
    startx : number;

    @Column({ type : 'decimal', nullable : false, default : 0 })
    starty : number;
    
    // 도착 좌표
    @Column({ type : 'decimal', nullable : false, default : 0 })
    endx : number;
    
    @Column({ type : 'decimal', nullable : false, default : 0 })
    endy : number;

    @ManyToOne(() => Users, (users) => users.records, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ type : 'int', name : 'userId', nullable : false })
    userId : number;

    @Column({ type : 'varchar', nullable : false})
    nickname : string;

    @CreateDateColumn({ type: 'date' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'date' })
    updatedAt: Date;

}
