import prisma from "#utils/prisma"
import type { Prisma } from "@prisma/client"

export class ProductRepository {
    async findAll(skip: number, take: number, where: Prisma.ProductsWhereInput, orderBy: Prisma.ProductsOrderByWithRelationInput) {
        return await prisma.products.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { category: true },
        })
    }

    async findComplex(categoryName: string, maxPrice: number) {
        return await prisma.products.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { category: { name: categoryName } },
                            { price: { lt: maxPrice } }
                        ]
                    },
                    { category: { name: 'Aksesoris' } },
                ]
            }
        })
    }

    async getStatistics() {
        return await prisma.products.aggregate({
            _count: { id: true },
            _avg: { price: true },
            _sum: { stock: true },
            _min: { price: true },
            _max: { price: true },
        })
    }

    async getProductsByCategoryStats() {
        return await prisma.products.groupBy({
            by: ['category_id'],
            _count: { id: true },
            _avg: { price: true },
        })
    }

    async countAll(where: Prisma.ProductsWhereInput) {
        return await prisma.products.count({ where })
    }

    async findById(id: number) {
        return await prisma.products.findUnique({
            where: { id, deletedAt: null },
            include: { category: true }
        })
    }

    async create(data: Prisma.ProductsCreateInput) {
        return await prisma.products.create({ data })
    }

    async update(id: number, data: Prisma.ProductsUpdateInput) {
        return await prisma.products.update({
            where: { id, deletedAt: null },
            data
        })
    }

    async delete(id: number) {
        return await prisma.products.update({
            where: { id },
            data: { deletedAt: new Date() }
        })
    }
}

export const findAll = async (skip: number, take: number, where: Prisma.ProductsWhereInput, orderBy: Prisma.ProductsOrderByWithRelationInput) => {
    return await prisma.products.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { category: true },
    })
}

export const countAll = async (where: Prisma.ProductsWhereInput) => {
    return await prisma.products.count({ where })
}

export const findById = async (id: number) => {
    return await prisma.products.findUnique({
        where: { id, deletedAt: null },
        include: { category: true }
    })
}

export const create = async (data: Prisma.ProductsCreateInput) => {
    return await prisma.products.create({ data })
}

export const update = async (id: number, data: Prisma.ProductsUpdateInput) => {
    return await prisma.products.update({
        where: { id, deletedAt: null },
        data
    })
}

export const softDelete = async (id: number) => {
    return await prisma.products.update({
        where: { id },
        data: { deletedAt: new Date() }
    })
}