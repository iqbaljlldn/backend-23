import prisma from "#utils/prisma";

export class UserService {
    static async getAll() {
        return await prisma.user.findMany({
            where: {
                deletedAt: null
            }
        });
    }

    static async getById(id: number) {
        return await prisma.user.findUnique({
            where: {
                id,
                deletedAt: null
            }
        });
    }

    static async create(data: { name: string, email: string }) {
        return await prisma.user.create({
            data
        });
    }

    static async update(id: number, data: { name?: string, email?: string }) {
        return await prisma.user.update({
            where: {
                id,
                deletedAt: null
            },
            data
        });
    }

    static async delete(id: number) {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
}
