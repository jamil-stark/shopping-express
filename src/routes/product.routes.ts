import express = require("express");
import { ProductController } from "../controllers/ProductController";

const router = express.Router();
const productController = new ProductController();

router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProductById);

export default router;