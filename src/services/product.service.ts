import prisma from "#utils/prisma"
import type { Prisma, Products } from "@prisma/client"

export class ProductService {
    static async getAll(): Promise<Products[]> {
        return await prisma.products.findMany();
    }

    static async getById(id: number): Promise<Products> {
        const product = await prisma.products.findUnique({
            where: { id }
        })
        if (!product) {
            throw new Error("Produk tidak ditemukan")
        }
        return product
    }

    static async create(data: { name: string, description: string, price: number, stock: number }): Promise<Products> {
        return await prisma.products.create({ data })
    }

    static async update(
        id: number,
        data: {
            name?: string,
            description?: string,
            price?: number,
            stock?: number,
        }): Promise<Products | undefined> {
        await this.getById(id)

        return await prisma.products.update({
            where: { id },
            data
        })
    }

    static async delete(id: number): Promise<Products | undefined> {
        await this.getById(id)

        return prisma.products.delete({ where: { id } })
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
            where
        })
    }
}