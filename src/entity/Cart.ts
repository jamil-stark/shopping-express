import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id: string

    @OneToOne(()=> User)
    @JoinColumn()
    user: User    
}