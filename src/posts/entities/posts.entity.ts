import { Category } from "src/types/Category.type";
import { PostComments } from "src/post-comments/entities/post-comment.entity";
import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name : 'posts'
})

export class Posts {
    
    @PrimaryGeneratedColumn()
    postId : number;

    @Column({ type : 'varchar', nullable : false })
    title : string;

    @Column({ type : 'enum', enum : Category, nullable : false })
    category : Category;

    @Column({ type : 'varchar', nullable : true })
    postImage? : string;

    @Column({ type : 'text', nullable : false })
    content : string;

    @Column({ type : 'bigint', nullable : false, default : 0 })
    views : bigint;

    @CreateDateColumn({ type : 'timestamp' })
    createdAt : Date;

    @UpdateDateColumn({ type : 'timestamp' })
    updatedAt : Date;

    @ManyToOne(() => Users, (users) => users.posts, {
        onDelete : 'CASCADE'
    })
    @JoinColumn({ name : "userId", referencedColumnName : 'userId' })
    users : Users; 
    
    @Column({ type : 'int', nullable : false })
    userId : number;

    @OneToMany(() => PostComments, (postComments) => postComments.posts )
    postComments : PostComments[];

}
