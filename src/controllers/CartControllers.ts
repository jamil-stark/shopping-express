import { Request, Response } from "express";
import { JWT } from "../security/jwt";
import { Cart } from "../entity/Cart";
import { AppDataSource } from "../data-source";
import { GeneralDTO } from "../dto/response/general.tdo";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

export class CartController {
  public static async getCartByUser(user: User) {
    const cartRepository = AppDataSource.getRepository(Cart);
    const cart = await cartRepository.find({
      relations: {
        product: true,
      },
      where: {
        user: { id: user.id },
      },
    });
    return cart;
  }

  async createCart(req: Request, res: Response) {
    try {
      const originalRequest: any = req.body;
      const cartRepository = AppDataSource.getRepository(Cart);
      const productRepository = AppDataSource.getRepository(Product);

      if (await JWT.verifyToken(req, res)) {
        if (!req.body) {
          res.status(400).json({ message: "Please provide all data" });
        }

        await cartRepository.delete({
          user: req.body.user.id,
        });

        await Promise.all(
          originalRequest.map(async (element) => {
            const cart = new Cart();
            cart.user = req.body.user;
            cart.product = await productRepository.findOneBy({
              id: element.productId,
            });
            cart.quantity = element.quantity;
            await cartRepository.save(cart);
          })
        );

        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 201;
        generalDTO.message = "Cart created Successfully";
        const cart = await CartController.getCartByUser(req.body.user);
        generalDTO.data = await CartController.getCartByUser(req.body.user);
        res.status(201).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllItemsInUserCart(req: Request, res: Response) {
    try {
      if (await JWT.verifyToken(req, res)) {
        if (!req.body) {
          res.status(400).json({ message: "Please provide all data" });
        }
        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 200;
        generalDTO.message = "Cart retrieved Successfully";
        generalDTO.data = await CartController.getCartByUser(req.body.user);
        res.status(200).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
