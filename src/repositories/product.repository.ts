import prisma from "#utils/prisma"
import type { Prisma } from "@prisma/client"

// src/repositories/product.repository.ts
import type { IProduct, ICreateProduct, IUpdateProduct } from "#model/product.model";

export class ProductRepository {
    // Simulasi database (ganti dengan real DB connection)
    private products: IProduct[] = [];
    private currentId = 1;

    async findAll(): Promise<IProduct[]> {
        return this.products;
    }

    async findById(id: number): Promise<IProduct | undefined> {
        return this.products.find(p => p.id === id);
    }

    async create(data: ICreateProduct): Promise<IProduct> {
        const newProduct: IProduct = {
            id: this.currentId++,
            ...data,
            createdAt: new Date()
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async update(id: number, data: IUpdateProduct): Promise<IProduct | undefined> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return undefined;

        this.products[index] = {
            ...this.products[index],
            ...data
        };
        return this.products[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        return true;
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