import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "#controllers/product.controller";
import { createProductValidation, getProductByIdValidation, updateProductValidation, validate } from "#middlewares/product.validation";
import { upload } from "#middlewares/upload.middleware";
import { Router } from "express";

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', validate(getProductByIdValidation), getProductById)
router.post('/', upload.single("image"), validate(createProductValidation), createProduct)
router.put('/:id', validate(updateProductValidation), updateProduct)
router.delete('/:id', validate(getProductByIdValidation), deleteProduct)

export default router