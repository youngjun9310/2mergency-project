import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name : 'users'
})
export class Users {
    @PrimaryGeneratedColumn()
    userId : number

    @Column({ type : 'varchar', nullable : false, unique : true })
    nickname : string

    @Column({ type : 'varchar', nullable : false, unique : true })
    email : string

    @Column({ type : 'varchar', nullable : false })
    password : string

    @Column({ type : 'varchar', nullable : false })
    address : string

    @Column({ type : 'bigint', nullable : true, default : 1000 })
    point : bigint

    @Column({ type : 'varchar', nullable : true })
    profileImage : string

    @Column({ type : 'boolean', nullable : false })
    isDelete : boolean

    @Column({ type : 'boolean', nullable : false, default : false })
    isAdmin : boolean

    @Column({ type : 'boolean', nullable : false, default : true })
    isOpen : boolean

    @Column({ type : 'date', nullable : false })
    createdAt : Date

    @Column({ type : 'date', nullable : false })
    updatedAt : Date

    @Column({ type : 'date', nullable : false })
    deletedAt : Date

}
