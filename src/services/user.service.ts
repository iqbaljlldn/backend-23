import prisma from "#utils/prisma";
import bcrypt from "bcrypt";

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

    static async create(data: { name: string, email: string, password: string, role?: string }) {
        return await prisma.user.create({
            data: {
                ...data,
                password_hash: await bcrypt.hash(data.password, 10)
            }
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
