import prisma from "#utils/prisma"
import type { Prisma, Products } from "@prisma/client"

export class ProductService {
    static async getAll(): Promise<Products[]> {
        return await prisma.products.findMany({
            include: {
                category: true,
            },
            where: {
                deletedAt: null,
            }
        });
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

    static async search(name?: string, maxPrice?: number): Promise<Products[]> {
        const where: Prisma.ProductsWhereInput = {}
        if (name) {
            where.name = {
                contains: name
            }
        }
        if (maxPrice) {
            where.price = {
                lte: maxPrice
            }
        }
        return await prisma.products.findMany({
            where: {
                ...where,
                deletedAt: null,
            },
            include: { category: true }
        })
    }
}