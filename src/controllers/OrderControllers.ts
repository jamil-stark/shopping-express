import { Request, Response } from "express";
import { JWT } from "../security/jwt";
import { CartController } from "./CartControllers";
import { Order } from "../entity/Order";
import { Helper } from "../utilities/helpers";
import { OrderItem } from "../entity/OrderItem";
import { AppDataSource } from "../data-source";
import { Cart } from "../entity/Cart";
import { Product } from "../entity/Product";
import { GeneralDTO } from "../dto/response/general.tdo";
import { User } from "../entity/User";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      if (await JWT.verifyToken(req, res)) {
        const user = req.body.user;
        const cartItems = await CartController.getUserCartAndProducts(user);
        const order = new Order();
        const userEntity = await Helper.getUserEntityById(user.id);
        order.user = userEntity;
        const orderRepository = AppDataSource.getRepository(Order);
        await orderRepository.save(order);

        const orderItemRepository = AppDataSource.getRepository(OrderItem);
        const productRepository = AppDataSource.getRepository(Product);
        cartItems.forEach((cartItem) => {
          const orderItem = new OrderItem();
          orderItem.product = cartItem.product;
          orderItem.quantity = cartItem.quantity;
          orderItem.order = order;
          orderItemRepository.save(orderItem);

          cartItem.product.inStock -= cartItem.quantity;
          productRepository.save(cartItem.product);
        });

        const cartRepository = AppDataSource.getRepository(Cart);
        await cartRepository.delete({
          user: user.id,
        });

        const generalDTO = new GeneralDTO();
        generalDTO.status = 201;
        generalDTO.message = "Order created";
        const orderResponseData = await orderRepository.find({
          relations: {
            orderItems: {
              product: true,
            },
          },
          where: {
            id: order.id,
          },
        });
        generalDTO.data = orderResponseData;
        res.status(201).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllOrderOfUser(req: Request, res: Response) {
    try {
      if (await JWT.verifyToken(req, res)) {
        const orderRepository = AppDataSource.getRepository(Order);
        const userEntity = await Helper.getUserEntityById(req.body.user.id);
        console.log("userEntity", userEntity);
        const orders = await orderRepository.find({
          relations: {
            user: true,
            orderItems: {
              product: true,
            },
          },
          where: {
            user: {
              id: userEntity.id,
            },
          }
        });
        const generalDTO = new GeneralDTO();
        generalDTO.status = 200;
        generalDTO.message = "Get all order of user";
        generalDTO.data = orders;
        res.status(200).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      if (await JWT.verifyToken(req, res)) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: {
            id: req.body.user.id,
          },
        });

        if (user.role !== "admin") {
          res.status(403).json({ message: "Forbidden" });
        } else {
          const orderRepository = AppDataSource.getRepository(Order);
          const orders = await orderRepository.find({
            relations: {
              user: true,
              orderItems: {
                product: true,
              },
            },
          });
          const generalDTO = new GeneralDTO();
          generalDTO.status = 200;
          generalDTO.message = "Get all order";
          generalDTO.data = orders;
          res.status(200).json(generalDTO);
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
