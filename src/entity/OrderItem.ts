import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem{
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(()=> Order, order => order.orderItems)
    order: Order

    @ManyToOne(()=> Product, product => product.orderItems)
    product: Product

    @Column()
    quantity: number
}