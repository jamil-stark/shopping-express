import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    price: number;

    @Column()
    inStock: number;

    @Column()
    imageURL: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    dateCreated: Date;

    @OneToMany(() => Cart, cart => cart.product)
    cart: Cart[];
    
}