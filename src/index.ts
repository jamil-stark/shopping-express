import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import * as express from "express"
import { Request, Response } from "express"

const app = express()
const port = 4000

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World")
});

app.listen(port, () => console.log(`Server started on port ${port}`));
