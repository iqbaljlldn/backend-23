import type { Request, Response, NextFunction } from "express";
import { ProductService, ProductServiceV2 } from "#services/product.service";
import { asyncHandler } from "#utils/async.handler";
import { errorResponse, successResponse } from "#utils/response";

export class ProductController {
    private productService: ProductServiceV2;

    constructor(productService: ProductServiceV2) {
        this.productService = productService;
    }

    // Arrow function untuk binding 'this' otomatis
    getProducts = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.productService.getAllProducts();
            res.json({
                success: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    }

    getProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const product = await this.productService.getProductById(id);
            res.json({
                success: true,
                data: product
            });
        } catch (error) {
            next(error);
        }
    }

    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json({
                success: true,
                data: product,
                message: 'Product created successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            const product = await this.productService.updateProduct(id, req.body);
            res.json({
                success: true,
                data: product,
                message: 'Product updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            await this.productService.deleteProduct(id);
            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.body.page) || 1
    const limit = Number(req.body.limit) || 10
    const search = req.body.search as any
    const sortBy = req.body.sortBy as string
    const sortOrder = (req.body.sortOrder as "asc" | "desc") || "desc"

    const results = await ProductService.getAll({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
    })

    const pagination = {
        page: results.currentPage,
        limit: limit,
        total: results.totalItems
    }

    return successResponse(res, "Daftar produk", results.products, pagination)
})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.getById(id)
    return successResponse(res, "Produk ditemukan", product)
})

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file
    if (!file) return errorResponse(res, "Gambar produk wajib diisi", 400)
    const imageUrl = `public/uploads/${file.filename}`
    const productData = {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        category_id: Number(req.body.category_id),
        image: imageUrl
    }
    const product = await ProductService.create(productData)
    return successResponse(res, "Produk berhasil ditambahkan", product, null, 201)
})

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.update(id, req.body)
    return successResponse(res, "Produk berhasil diperbarui", product)
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.delete(id)
    return successResponse(res, "Produk berhasil dihapus", product)
})

// export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
//     const { name, max_price } = req.query

//     const products = await ProductService.search(
//         name as string,
//         max_price ? Number(max_price) : undefined
//     )
//     return successResponse(res, "Hasil pencarian", products)
// })