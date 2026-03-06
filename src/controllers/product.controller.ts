import type { Request, Response } from "express";
import { ProductService } from "#services/product.service";
import { asyncHandler } from "#utils/async.handler";
import { errorResponse, successResponse } from "#utils/response";

export const getAllProducts = asyncHandler(async (_req: Request, res: Response) => {
    const products = await ProductService.getAll()
    return successResponse(res, "Daftar produk", products)
})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.getById(id)
    return successResponse(res, "Produk ditemukan", product)
})

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file
    if (!file) return errorResponse(res, "Gambar produk wajib diisi", 400)
    const imageUrl = `public/uploads/${file.filename}`
    const productData = {
        ...req.body,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        category_id: Number(req.body.category_id),
        image: imageUrl
    }
    const product = await ProductService.create(productData)
    return successResponse(res, "Produk berhasil ditambahkan", product, null, 201)
})

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.update(id, req.body)
    return successResponse(res, "Produk berhasil diperbarui", product)
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = await ProductService.delete(id)
    return successResponse(res, "Produk berhasil dihapus", product)
})

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { name, max_price } = req.query

    const products = await ProductService.search(
        name as string,
        max_price ? Number(max_price) : undefined
    )
    return successResponse(res, "Hasil pencarian", products)
})