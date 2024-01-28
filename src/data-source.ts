import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { RefreshToken } from "./entity/RefreshToken"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "stark",
    database: "shopping",
    synchronize: true,
    logging: false,
    entities: [User, RefreshToken],
    migrations: [],
    subscribers: [],
})
