import { UserController } from "../controllers/UserController";
import exp = require("constants");
import express = require("express");

const router = express.Router();
const userController = new UserController();

// router.get("/", userController.getUser);
router.post("/", userController.register);

export default router;
