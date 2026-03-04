import { UserService } from "#services/user.service";
import { errorResponse, successResponse } from "#utils/response";
import type { Request, Response } from "express";

export const index = async (_req: Request, res: Response) => {
    try {
        const users = await UserService.getAll();
        return successResponse(res, "Get all users success", users);
    } catch (error) {
        return errorResponse(res, `Get all users failed: ${error}`, 500);
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserService.getById(Number(id));
        if (!user) return errorResponse(res, "User not found", 404);
        return successResponse(res, "Get user detail success", user);
    } catch (error) {
        return errorResponse(res, `Get user detail failed: ${error}`, 500);
    }
};

export const store = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserService.create({ name, email, password });
        return successResponse(res, "Create user success", user, null, 201);
    } catch (error) {
        return errorResponse(res, `Create user failed: ${error}`, 500);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await UserService.update(Number(id), { name, email });
        return successResponse(res, "Update user success", user);
    } catch (error) {
        return errorResponse(res, `Update user failed: ${error}`, 500);
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await UserService.delete(Number(id));
        return successResponse(res, "Delete user success");
    } catch (error) {
        return errorResponse(res, `Delete user failed: ${error}`, 500);
    }
};
