import express = require("express");
import { OrderController } from "../controllers/OrderControllers";

const router = express.Router();
const orderController = new OrderController();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrderOfUser);
router.get("/all", orderController.getAllOrders);

export default router;