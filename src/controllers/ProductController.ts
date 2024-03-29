import { Request, Response } from "express";
import { UploadProductDTO } from "../dto/request/uploadProduct.dto";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { GeneralDTO } from "../dto/response/general.tdo";

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
            const generalDTO: GeneralDTO = new GeneralDTO();
            generalDTO.status = 201
            generalDTO.message = "Product created successfully!"
            generalDTO.data = product
            res.status(201).json(generalDTO)
        }catch(error){
            console.error("Error during product creation:", error)
            res.status(500).json({message: error.message})
        }
    }

    async getAllProducts(req: Request, res: Response){
        const productRepository = AppDataSource.getRepository(Product)
        const products = await productRepository.find()
        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 200
        generalDTO.message = "Products retrieved successfully!"
        generalDTO.data = products
        res.status(200).json(generalDTO)
    }

    async getProductById(req: Request, res: Response){
        const productRepository = AppDataSource.getRepository(Product)
        const product = await productRepository.findOneBy({id: parseInt(req.params.id)})
        if(!product){
            res.status(404).json({message: "Product not found!"})
            return
        }
        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 200
        generalDTO.message = "Product retrieved successfully!"
        generalDTO.data = product
        res.status(200).json(generalDTO)
    }

    async deleteProductById(req: Request, res: Response){
        const productRepository = AppDataSource.getRepository(Product)
        const product = await productRepository.findOneBy({id: parseInt(req.params.id)})
        if(!product){
            res.status(404).json({message: "Product not found!"})
            return
        }
        await productRepository.remove(product)
        const generalDTO: GeneralDTO = new GeneralDTO();
        generalDTO.status = 200
        generalDTO.message = "Product deleted successfully!"
        res.status(200).json(generalDTO)
    }

}