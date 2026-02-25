import { errorResponse } from "#utils/response"
import type { NextFunction, Request, Response } from "express"
import { body, param, validationResult, type ValidationChain } from "express-validator"

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        const errorList = errors.array().map((err: { type: string, msg: string, path?: string }) => ({
            field: err.type === 'field' ? (err.path ?? 'unknown') : 'unknown',
            message: err.msg
        }))

        return errorResponse(res, "Validasi gagal", 400, errorList)
    }
}

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('description')
        .trim()
        .notEmpty().withMessage('Deskripsi wajib diisi'),

    body('price')
        .isNumeric().withMessage('Harga harus angka')
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),

    body('stock')
        .isNumeric().withMessage('Stock harus angka')
        .custom(value => value >= 0).withMessage('Stock harus lebih dari 0'),

    body('category_id')
        .isNumeric().withMessage('Category ID harus angka')
        .custom(value => value > 0).withMessage('Category ID harus lebih dari 0'),
]

export const updateProductValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('description')
        .optional()
        .trim(),

    body('price')
        .optional()
        .isNumeric().withMessage('Harga harus angka')
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),

    body('stock')
        .optional()
        .isNumeric().withMessage('Stock harus angka')
        .custom(value => value >= 0).withMessage('Stock harus lebih dari 0'),

    body('category_id')
        .optional()
        .isNumeric().withMessage('Category ID harus angka')
        .custom(value => value > 0).withMessage('Category ID harus lebih dari 0'),
]

export const getProductByIdValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka'),
];