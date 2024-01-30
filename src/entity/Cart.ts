import { Column, Entity, JoinColumn, JoinTable, OneToMany as ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id: string

    @ManyToOne(()=> User, user => user.cart)
    user: User

    @ManyToOne(()=> Product)
    product: Product

    @Column()
    quantity: number
}