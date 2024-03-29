import { Request, Response } from "express";
import { JWT } from "../security/jwt";
import { Cart } from "../entity/Cart";
import { AppDataSource } from "../data-source";
import { GeneralDTO } from "../dto/response/general.tdo";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

export class CartController {
  public static async getUserCartAndProducts(user: User) {
    const cartRepository = AppDataSource.getRepository(Cart);
    const cart = await cartRepository.find({
      relations: {
        product: true,
      },
      where: {
        user: { id: user.id },
      },
    });
    // check if cart has duplicate products and delete it from the cart database
    const duplicateProducts = cart.filter(
      (item, index, self) =>
        index !== self.findIndex((t) => t.product.id === item.product.id)
    );
    if (duplicateProducts.length > 0) {
      await Promise.all(
        duplicateProducts.map(async (element) => {
          await cartRepository.remove(element);
        })
      );
    }
    return await cartRepository.find({
      relations: {
        product: true,
      },
      where: {
        user: { id: user.id },
      },
    });
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
        const cart = await CartController.getUserCartAndProducts(req.body.user);
        generalDTO.data = cart;
        generalDTO.count = cart.length;
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
        const itemsInUserCart = await CartController.getUserCartAndProducts(
          req.body.user
        );
        generalDTO.data = itemsInUserCart;
        generalDTO.count = itemsInUserCart.length;
        res.status(200).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteItemInUserCart(req: Request, res: Response) {
    try {
      if (await JWT.verifyToken(req, res)) {
        const cartRepository = AppDataSource.getRepository(Cart);
        const productRepository = AppDataSource.getRepository(Product);
        const product = await productRepository.findOneBy({
          id: parseInt(req.params.id),
        });
        if (!product) {
          res.status(404).json({ message: "Product not found!" });
          return;
        }

        const userRepositoy = AppDataSource.getRepository(User);
        const user = await userRepositoy.findOneBy({ id: req.body.user.id });
        const cart = await cartRepository.find({
          relations: {
            product: true,
          },
          where: {
            user: { id: user.id },
            product: { id: product.id },
          },
        });

        if (!cart) {
          res.status(404).json({ message: "Product not found in cart!" });
          return;
        }

        await cartRepository.remove(cart);
        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 200;
        generalDTO.message = "Product deleted successfully!";
        const itemsInUserCart = await CartController.getUserCartAndProducts(user);
        generalDTO.data = itemsInUserCart;
        generalDTO.count = itemsInUserCart.length;
        res.status(200).json(generalDTO);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
