import express = require("express");
import { ProductController } from "../controllers/ProductController";
import exp = require("constants");

const router = express.Router();
const productController = new ProductController();

router.post("/", productController.createProduct);

export default router;