import express = require("express");
import { OrderController } from "../controllers/OrderControllers";

const router = express.Router();
const orderController = new OrderController();

router.post("/", orderController.createOrder);

export default router;