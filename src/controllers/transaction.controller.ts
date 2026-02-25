import { TransactionService } from "#services/transaction.service"
import { errorResponse, successResponse } from "#utils/response"
import type { Request, Response } from "express"

export const checkout = async (req: Request, res: Response) => {
    try {
        const { userId, items } = req.body

        const result = await TransactionService.checkout(userId, items)

        return successResponse(res, "Checkout success", result, null, 201)
    } catch (error) {
        console.log(error)
        return errorResponse(res, `Checkout failed: ${error}`, 500)
    }
}

export const getDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const result = await TransactionService.getTransactionById(Number(id))
        if (!result) return errorResponse(res, "Transaction not found", 404)
        return successResponse(res, "Get transaction detail success", result, null, 200)
    } catch (error) {
        console.log(error)
        return errorResponse(res, `Get transaction detail failed: ${error}`, 500)
    }
}