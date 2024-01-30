import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import { RefreshToken } from "./RefreshToken"
import { Cart } from "./Cart"

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

    @OneToMany(type => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken;    
    
    @OneToMany(() => Cart, cart => cart.user)
    cart: Cart[];
}
