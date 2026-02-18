import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProduct } from "#controllers/product.controller";
import { createProductValidation, getProductByIdValidation, updateProductValidation, validate } from "#middlewares/product.validation";
import { Router } from "express";

const router = Router()

router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/:id', validate(getProductByIdValidation), getProductById)
router.post('/', validate(createProductValidation), createProduct)
router.put('/:id', validate(updateProductValidation), updateProduct)
router.delete('/:id', validate(getProductByIdValidation), deleteProduct)

export default router