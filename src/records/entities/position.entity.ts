import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name : 'position'
})

export class Position {

    @PrimaryGeneratedColumn()
    positionId : number;

    // 시작 좌표
    @Column({ type : 'bigint', nullable : true })
    startx : bigint;

    @Column({ type : 'bigint', nullable : true })
    starty : bigint;

    // 도착 좌표
    @Column({ type : 'bigint', nullable : true })
    endx : bigint;
    
    @Column({ type : 'bigint', nullable : true })
    endy : bigint;

    @CreateDateColumn({ type : 'timestamp' })
    createdAt : Date;

    @UpdateDateColumn({ type : 'timestamp' })
    updatedAt : Date;

    @ManyToOne(() => Users, (users) => users.position, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;

    @Column({ name : 'userId', type : 'int', nullable : false })
    userId : number;

}