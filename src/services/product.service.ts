import { countAll, create, findAll, findById, softDelete, update } from "#repositories/product.repository"
import type { Prisma, Products } from "@prisma/client"
// src/services/product.service.ts
import { ProductRepository } from '#repositories/product.repository';
import type { IProduct, ICreateProduct, IUpdateProduct } from "#model/product.model";

interface FindAllParams {
    page: number
    limit: number
    search?: {
        name?: string
        maxPrice?: number
    }
    sortBy?: string;
    sortOrder?: 'asc' | 'desc'
}


export class ProductServiceV2 {
    private repository: ProductRepository;

    constructor(repository: ProductRepository) {
        this.repository = repository;
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await this.repository.findAll();
    }

    async getProductById(id: number): Promise<IProduct> {
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        return product;
    }

    async createProduct(data: ICreateProduct): Promise<IProduct> {
        // Business logic: validasi
        if (data.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        if (data.stock < 0) {
            throw new Error('Stock cannot be negative');
        }

        return await this.repository.create(data);
    }

    async updateProduct(id: number, data: IUpdateProduct): Promise<IProduct> {
        const product = await this.repository.update(id, data);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        return product;
    }

    async deleteProduct(id: number): Promise<void> {
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new Error(`Product with id ${id} not found`);
        }
    }

    async checkStock(id: number): Promise<boolean> {
        const product = await this.getProductById(id);
        return (product.stock ?? 0) > 0;
    }
}

export class ProductService {
    static async getAll(params: FindAllParams) {
        const { page, limit, search, sortBy, sortOrder } = params

        const skip = (page - 1) * limit

        const whereClause: Prisma.ProductsWhereInput = {
            deletedAt: null,
        }

        if (search?.name) {
            whereClause.name = {
                contains: search.name,
                mode: 'insensitive'
            }
        }

        if (search?.maxPrice) {
            whereClause.price = {
                lte: search.maxPrice
            }
        }

        const sortCriteria: Prisma.ProductsOrderByWithRelationInput = sortBy ? { [sortBy]: sortOrder || "desc" } : { createdAt: "desc" }

        const products = await findAll(skip, limit, whereClause, sortCriteria)

        const totalItems = await countAll(whereClause)

        return {
            products,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        }
    }

    static async getById(id: number): Promise<Products> {
        const product = await findById(id)
        if (!product) {
            throw new Error("Produk tidak ditemukan")
        }
        return product
    }

    static async create(data: any): Promise<Products> {
        if (data.stock < 0) throw new Error("Stock tidak boleh negatif")
        if (data.price < 0) throw new Error("Harga tidak boleh negatif")
        return await create(data)
    }

    static async update(
        id: number,
        data: any): Promise<Products | undefined> {
        await this.getById(id)

        if (data.stock < 0) throw new Error("Stock tidak boleh negatif")
        if (data.price < 0) throw new Error("Harga tidak boleh negatif")

        return await update(id, data)
    }

    static async delete(id: number): Promise<Products | undefined> {
        await this.getById(id)

        return softDelete(id)
    }

    // static async search(name?: string, maxPrice?: number): Promise<Products[]> {
    //     const where: Prisma.ProductsWhereInput = {}
    //     if (name) {
    //         where.name = {
    //             contains: name
    //         }
    //     }
    //     if (maxPrice) {
    //         where.price = {
    //             lte: maxPrice
    //         }
    //     }
    //     return await prisma.products.findMany({
    //         where: {
    //             ...where,
    //             deletedAt: null,
    //         },
    //         include: { category: true }
    //     })
    // }
}