import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name : 'position'
})

export class Position {

    @PrimaryGeneratedColumn()
    positionId : number;

    // 시작 좌표
    @Column({ type : 'decimal', nullable : false })
    startx : number;

    @Column({ type : 'decimal', nullable : false })
    starty : number;
    
    // 도착 좌표
    @Column({ type : 'decimal', nullable : false })
    endx : number;
    
    @Column({ type : 'decimal', nullable : false })
    endy : number;

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