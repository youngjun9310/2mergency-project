import { Posts } from "src/posts/entities/posts.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name : 'postComments'
})

export class PostComments {

   @PrimaryGeneratedColumn()
   postcommentId : number; 

   @Column({ type : 'text', nullable : false })
    content : string;

    @CreateDateColumn({ type : 'timestamp' })
    createdAt : Date;

    @UpdateDateColumn({ type : 'timestamp' })
    updatedAt : Date;

    // @ManyToOne(() => Users, (users) => users.postComments, {
    //     onDelete : 'CASCADE'
    // })
    @JoinColumn({ name: 'userId', referencedColumnName : 'userId' })
    users : Users;

   @Column({ type : 'int', nullable : false })
    userId : number;

    @ManyToOne(() => Posts, (posts) => posts.postComments, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name: 'postId', referencedColumnName : 'postId' })
    posts : Posts;

    @Column({ type : 'int', nullable : false })
    postId : number;

}
