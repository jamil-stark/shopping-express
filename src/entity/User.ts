import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    fullname: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ nullable: true})
    role: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dateCreated: Date;
}
