import { Request, Response } from "express";
import { JWT } from "../security/jwt";
import { Cart } from "../entity/Cart";
import { AppDataSource } from "../data-source";
import { GeneralDTO } from "../dto/response/general.tdo";

export class CartController{
    async createCart(req: Request, res: Response){
        try{
        if (await JWT.verifyToken(req, res)){
            if (!req.body){
                res.status(400).json({message: "Please provide all data"})
            }
            const cart = new Cart()
            cart.user = req.body.user
            const cartRepository = AppDataSource.getRepository(Cart)
            await cartRepository.save(cart)
            res.status(201).json({message: "Cart Saved!"})

        }} catch(error){
            res.status(500).json({message: error.message})
        }
    }

    async getAllItemsInUserCart(req: Request, res: Response){
        try{
            if (await JWT.verifyToken(req, res)){
                if (!req.body){
                    res.status(400).json({message: "Please provide all data"})
                }
                const cartRepository = AppDataSource.getRepository(Cart)
                const cart = await cartRepository.findOne({
                    relations: {
                        user: true
                    },
                    where: {
                        user: req.body.user.id
                    },
                })
                console.log(req.body.user.id)
                console.log(cart)
                const generalDTO: GeneralDTO = new GeneralDTO()
                generalDTO.status = 200
                generalDTO.message = "Cart retrieved Successfully"
                generalDTO.data = cart
                res.status(200).json(generalDTO)
            }
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }

}