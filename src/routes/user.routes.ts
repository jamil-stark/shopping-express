import { UserController } from "../controllers/UserController";
import express = require("express");

const router = express.Router();
const userController = new UserController();

router.post("/", userController.register);
router.get("/", userController.getAllUsers);
router.post("/login", userController.login);
// router.get("/get-user-by-token", userController.getUserByToken);

export default router;
