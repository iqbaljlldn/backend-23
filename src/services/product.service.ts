import prisma from "#utils/prisma"
import type { Prisma, Products } from "@prisma/client"

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

        const products = await prisma.products.findMany({
            skip: skip,
            take: limit,
            where: whereClause,
            orderBy: sortBy ? { [sortBy]: sortOrder || 'desc' } : { createdAt: 'desc' },
            include: {
                category: true,
            },
        });

        const totalItems = await prisma.products.count({
            where: whereClause
        })

        return {
            products,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        }
    }

    static async getById(id: number): Promise<Products> {
        const product = await prisma.products.findUnique({
            where: {
                id,
                deletedAt: null
            },
            include: {
                category: true,
            }
        })
        if (!product) {
            throw new Error("Produk tidak ditemukan")
        }
        return product
    }

    static async create(data: {
        name: string,
        description: string,
        price: number,
        stock: number,
        category_id: number,
        image: string,
    }): Promise<Products> {
        return await prisma.products.create({ data, include: { category: true } })
    }

    static async update(
        id: number,
        data: {
            name?: string,
            description?: string,
            price?: number,
            stock?: number,
            category_id?: number
        }): Promise<Products | undefined> {
        await this.getById(id)

        return await prisma.products.update({
            where: {
                id,
                deletedAt: null
            },
            data,
            include: { category: true }
        })
    }

    static async delete(id: number): Promise<Products | undefined> {
        await this.getById(id)

        return prisma.products.update({
            where: {
                id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        })
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