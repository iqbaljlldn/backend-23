import { body, param } from "express-validator";

export const createCategoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama kategori wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama kategori minimal 3 karakter'),
]

export const updateCategoryValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Nama kategori minimal 3 karakter'),
]