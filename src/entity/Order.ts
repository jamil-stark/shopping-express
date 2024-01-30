import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> User, user => user.orders)
    user: User

    @OneToMany(()=> OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[]

    @Column({default: "pending"})
    status: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dateCreated: Date;   
}