import express = require("express");
import { CartController } from "../controllers/CartControllers";

const router = express.Router()
const cartController = new CartController()

router.post("/", cartController.createCart);
router.get("/", cartController.getAllItemsInUserCart);
router.delete("/:id", cartController.deleteItemInUserCart);

export default router;