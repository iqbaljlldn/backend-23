import express, { type NextFunction, type Request, type Response } from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import { successResponse } from "#utils/response"
import productRouter from "#routes/product.route"
import categoryRouter from "#routes/category.route"
import transactionRouter from "#routes/transaction.route"
import userRouter from "#routes/user.route"
import authRouter from "#routes/auth.route"
import { errorHandler } from "#middlewares/error.handler"
const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./"))

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`Request masuk jam ${new Date().toISOString()}`)
    req.startTime = Date.now()
    next()
})

// app.use((req: Request, res: Response, next: NextFunction) => {
//     const apiKey = req.headers['x-api-key']
//     if (!apiKey) {
//         return res.status(401).json({
//             success: false,
//             message: "Header X-API-Key wajib diisi untuk akses API!"
//         });
//     }

//     if (apiKey !== 'secret-api-key-123') {
//         return res.status(403).json({
//             success: false,
//             message: "API Key tidak valid!"
//         });
//     }

//     next()
// })

app.get('/', (req: Request, res: Response) => {
    const processTime = Date.now() - (req.startTime ?? Date.now())
    successResponse(
        res,
        "Selamat datang",
        {
            hari: 4,
            status: "Server hidup!",
            waktu_proses: `${processTime} ms`
        },
        null,
        200
    )
})

app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

app.use((req: Request, _res: Response) => {
    throw new Error(`Route ${req.originalUrl} tidak ditemukan`);
})

export default app