import { UserController } from "../controllers/UserController";
import exp = require("constants");
import express = require("express");

const router = express.Router();
const userController = new UserController();

router.post("/", userController.register);
router.get("/", userController.getAllUsers);

export default router;
