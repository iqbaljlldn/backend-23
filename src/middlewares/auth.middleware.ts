import { errorResponse } from "#utils/response";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret_kunci_rahasia"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return errorResponse(res, "Header authorization wajib diisi")
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token!, JWT_SECRET) as { id: number, role: string }

        req.user = payload

        next()
    } catch (error) {
        return errorResponse(res, "Token tidak valid")
    }
}