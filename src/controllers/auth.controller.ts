import { AuthService } from "#services/auth.service";
import { asyncHandler } from "#utils/async.handler";
import { successResponse } from "#utils/response";
import type { Request, Response } from "express";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.register(req.body)
    const { password_hash, ...userWithoutPassword } = user

    return successResponse(res, "Register berhasil", userWithoutPassword, null, 201)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body)

    return successResponse(res, "Login berhasil", result)
})