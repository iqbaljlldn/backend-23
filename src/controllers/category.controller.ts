import { asyncHandler } from "#utils/async.handler";
import { CategoryService } from "#services/category.service";
import { successResponse } from "#utils/response";
import type { Request, Response } from "express";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAll()
    successResponse(res, "Data kategori berhasil diambil", categories, null, 200)
})

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await CategoryService.getById(Number(id))
    successResponse(res, "Data kategori berhasil diambil", category, null, 200)
})

export const create = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body
    const category = await CategoryService.create({ name })
    successResponse(res, "Data kategori berhasil ditambahkan", category, null, 201)
})

export const update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { name } = req.body
    const category = await CategoryService.update(Number(id), { name })
    successResponse(res, "Data kategori berhasil diupdate", category, null, 200)
})

export const remove = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await CategoryService.delete(Number(id))
    successResponse(res, "Data kategori berhasil dihapus", category, null, 200)
})

export const search = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query
    const categories = await CategoryService.search(name as string)
    successResponse(res, "Data kategori berhasil dicari", categories, null, 200)
})