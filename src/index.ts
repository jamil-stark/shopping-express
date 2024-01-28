import { AppDataSource } from "./data-source";
import * as express from "express";
import userRoutes from "./routes/user.routes";

const app = express();
const port = 4000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection failed. Error: ", err));

app.use(express.json());
app.use("/api/v1/users", userRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
