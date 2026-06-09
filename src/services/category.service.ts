import prisma from "#utils/prisma";
import type { Categories, Prisma } from "@prisma/client";

export class CategoryService {
    static async getAll(): Promise<Categories[]> {
        return await prisma.categories.findMany()
    }

    static async getById(id: number): Promise<Categories> {
        const category = await prisma.categories.findUnique({
            where: { id }
        })
        if (!category) {
            throw new Error("Kategori tidak ditemukan")
        }
        return category
    }

    static async create(data: { name: string }): Promise<Categories> {
        return await prisma.categories.create({ data })
    }

    static async update(id: number, data: { name: string }): Promise<Categories> {
        await this.getById(id)
        return await prisma.categories.update({
            where: { id },
            data
        })
    }

    static async delete(id: number): Promise<Categories> {
        await this.getById(id)
        return await prisma.categories.delete({
            where: { id }
        })
    }

    static async search(name?: string): Promise<Categories[]> {
        const where: Prisma.CategoriesWhereInput = {}
        if (name) {
            where.name = {
                contains: name
            }
        }
        return await prisma.categories.findMany({
            where
        })
    }
}