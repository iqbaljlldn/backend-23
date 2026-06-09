import { checkout, getDetail } from "#controllers/transaction.controller";
import { authenticate } from "#middlewares/auth.middleware";
import { Router } from "express";

const router = Router()

router.post("/checkout", authenticate, checkout)
router.get("/:id", authenticate, getDetail)

export default router