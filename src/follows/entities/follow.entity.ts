import { Users } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name : 'follows'
})

export class Follows {
    
    @PrimaryGeneratedColumn()
    followerId : number;

    @Column({ type : 'int', nullable : false , default : 0 })
    followingId : number;

    @ManyToOne(() => Users, (users) => users.follows, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : 'userId', referencedColumnName : 'userId' })
    users : Users;
    
    @Column({ type : 'int', nullable : false })
    userId : number;

}
