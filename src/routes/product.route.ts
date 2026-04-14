// import { createProduct, deleteProduct, getAllProducts, getProductById, ProductController, updateProduct } from "#controllers/product.controller";
import { createProductValidation, getProductByIdValidation, updateProductValidation, validate } from "#middlewares/product.validation";
import { upload } from "#middlewares/upload.middleware";
import { Router } from "express";
import { ProductServiceV2 } from "#services/product.service";
import { ProductRepository } from "#repositories/product.repository";
import { ProductController } from "#controllers/product.controller";

const router = Router()

// router.get('/', getAllProducts)
// router.get('/:id', validate(getProductByIdValidation), getProductById)
// router.post('/', upload.single("image"), validate(createProductValidation), createProduct)
// router.put('/:id', validate(updateProductValidation), updateProduct)
// router.delete('/:id', validate(getProductByIdValidation), deleteProduct)

const productRepo = new ProductRepository()
const productService = new ProductServiceV2(productRepo)
const productController = new ProductController(productService)

router.get('/', productController.getProducts)
router.get('/:id', validate(getProductByIdValidation), productController.getProduct)
router.post('/', upload.single("image"), validate(createProductValidation), productController.createProduct)
router.put('/:id', validate(updateProductValidation), productController.updateProduct)
router.delete('/:id', validate(getProductByIdValidation), productController.deleteProduct)

export default router