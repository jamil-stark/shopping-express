import { Request, Response } from "express";
import { UploadProductDTO } from "../dto/request/uploadProduct.dto";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

export class ProductController{
    async createProduct(req: Request, res: Response){
        const body: UploadProductDTO = req.body;
        const productRepository = AppDataSource.getRepository(Product)
        if (!body.category || !body.description || !body.imageURL || !body.inStock || !body.name || !body.price){
            res.status(400).json({message: "Please provide all required fields"})
            return
        }
        const product = new Product()
        product.category = body.category
        product.description = body.description
        product.imageURL = body.imageURL
        product.inStock = body.inStock
        product.name = body.name
        product.price = body.price
        try{
            await productRepository.save(product)
            res.status(201).json({message: "Product created successfully!"})
        }catch(error){
            console.error("Error during product creation:", error)
            res.status(500).json({message: error.message})
        }
    }

}