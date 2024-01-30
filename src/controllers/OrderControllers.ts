import { Request, Response } from "express";
import { JWT } from "../security/jwt";
import { CartController } from "./CartControllers";
import { Order } from "../entity/Order";
import { Helper } from "../utilities/helpers";
import { OrderItem } from "../entity/OrderItem";
import { AppDataSource } from "../data-source";
import { Cart } from "../entity/Cart";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    // try{
        if (await JWT.verifyToken(req, res)) {
            const user = req.body.user;
            const cartItems = await CartController.getUserCartAndProducts(user)
            const order = new Order();
            const userEntity = await Helper.getUserEntityById(user.id);
            order.user = userEntity;
            console.log("user", userEntity);
            const orderRepository = AppDataSource.getRepository(Order);
            await orderRepository.save(order);

            const orderItemRepository = AppDataSource.getRepository(OrderItem);
            cartItems.forEach(cartItem => {
                const orderItem = new OrderItem();
                orderItem.product = cartItem.product;
                orderItem.quantity = cartItem.quantity;
                orderItem.order = order;
                orderItemRepository.save(orderItem);
            });

            const cartRepository = AppDataSource.getRepository(Cart);
            await cartRepository.delete({
                user: user.id,
            });
            res.status(201).json({ message: "Order created Successfully" });
        }
    // } catch (error) {
        // res.status(500).json({ message: error.message });
        // }
  }
}
