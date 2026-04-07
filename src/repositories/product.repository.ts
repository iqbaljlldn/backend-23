import prisma from "#utils/prisma"
import type { Prisma } from "@prisma/client"

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