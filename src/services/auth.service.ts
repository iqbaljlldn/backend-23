import prisma from "#utils/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    static JWT_SECRET = process.env.JWT_SECRET || "secret_kunci_rahasia"

    static async register(data: { name: string, email: string, password: string, role?: string }) {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (existingUser) {
            throw new Error("Email sudah terdaftar")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        return await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password_hash: hashedPassword,
                role: data.role || "USER"
            }
        })
    }

    static async login(data: { email: string, password: string }) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })

        if (!user) {
            throw new Error("Email atau password salah")
        }

        const isValid = await bcrypt.compare(data.password, user.password_hash)

        if (!isValid) {
            throw new Error("Email atau password salah")
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            AuthService.JWT_SECRET,
            { expiresIn: "1h" },
        )

        return { user, token }
    }
}