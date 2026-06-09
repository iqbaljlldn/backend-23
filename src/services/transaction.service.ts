import prisma from "#utils/prisma";

export class TransactionService {
    static async checkout(userId: number, items: { productId: number, quantity: number }[]) {
        return await prisma.$transaction(async (tx) => {
            let total = 0;
            const transactionItemsData = []

            for (const item of items) {
                const product = await tx.products.findUnique({
                    where: {
                        id: item.productId,
                        deletedAt: null
                    }
                })

                if (!product) throw new Error(`Product with ID ${item.productId} not found`)

                if (product.stock < item.quantity) throw new Error(`Product ${product.name} is out of stock`)

                const currentPrice = Number(product.price)
                total += currentPrice * item.quantity

                transactionItemsData.push({
                    product_id: product.id,
                    quantity: item.quantity,
                    price_at_time: product.price
                })

                await tx.products.update({
                    where: {
                        id: product.id,
                        deletedAt: null
                    },
                    data: {
                        stock: { decrement: item.quantity }
                    }
                })
            }

            const newTransaction = await tx.transactions.create({
                data: {
                    userId,
                    total_price: total,
                    transactionItems: {
                        create: transactionItemsData
                    }
                },
                include: {
                    transactionItems: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            return newTransaction
        })
    }

    static async getTransactionById(id: number) {
        return await prisma.transactions.findUnique({
            where: { id },
            include: {
                user: true,
                transactionItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
}