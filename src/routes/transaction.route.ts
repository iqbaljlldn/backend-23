import { checkout, getDetail } from "#controllers/transaction.controller";
import { Router } from "express";

const router = Router()

router.post("/checkout", checkout)
router.get("/:id", getDetail)

export default router