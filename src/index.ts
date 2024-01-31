import { AppDataSource } from "./data-source";
import * as express from "express";
import userRoutes from "./routes/user.routes";
import producRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection failed. Error: ", err));

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", producRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/order", orderRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
