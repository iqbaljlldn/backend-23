import express, { type NextFunction, type Request, type Response } from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { body, param, validationResult, type ValidationChain } from 'express-validator'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 1
interface CustomRequest extends Request {
    startTime?: number;
}

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 2
app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
    console.log(`Request masuk jam ${new Date().toISOString()}`)
    req.startTime = Date.now()
    next()
})

// 3
app.use((req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "Header X-API-Key wajib diisi untuk akses API!"
        });
    }

    if (apiKey !== 'secret-api-key-123') {
        return res.status(403).json({
            success: false,
            message: "API Key tidak valid!"
        });
    }

    next()
})

// 4
interface Product {
    id: number
    nama: string
    deskripsi: string
    harga: number
}

let products: Product[] = [
    { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
    { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
    { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 }
]

// 5
interface ApiResponse {
    success: boolean
    message: string
    data?: unknown
    pagination?: {
        page: number
        limit: number
        total: number
    }
    errors?: Array<{
        field: string
        message: string
    }> | { stack?: string }
}

// 6
const successResponse = (
    res: Response,
    message: string,
    data: unknown = null,
    pagination: { page: number; limit: number; total: number } | null = null,
    statusCode: number = 200
) => {
    const response: ApiResponse = {
        success: true,
        message
    }

    if (data !== null) response.data = data
    if (pagination) response.pagination = pagination

    return res.status(statusCode).json(response)
}

// 7
const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400,
    errors: Array<{ field: string, message: string }> | { stack?: string } | null = null,
) => {
    const response: ApiResponse = {
        success: false,
        message,
    }

    if (errors) response.errors = errors

    return res.status(statusCode).json(response)
}

// 8
const validate = (validations: ValidationChain[]) => {
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

// 9
const createProductValidation = [
    body('nama')
        .trim()
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('deskripsi')
        .trim()
        .notEmpty().withMessage('Deskripsi wajib diisi'),

    body('harga')
        .isNumeric().withMessage('Harga harus angka')
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0')
]

const updateProductValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka'),

    body('nama')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('deskripsi')
        .optional()
        .trim(),

    body('harga')
        .optional()
        .isNumeric().withMessage('Harga harus angka')
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0')
]

// 10
const getProductByIdValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka'),
];

// 11
app.get('/', (req: CustomRequest, res: Response) => {
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

// 12
app.get('/api/products', (_req: Request, res: Response) => {
    successResponse(res, 'Daftar produk', products);
})

// 13
app.get('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const product = products.find(p => p.id === id)

    if (!product) {
        throw new Error('Produk dengan ID tersebut tidak ditemukan');
    }

    successResponse(res, 'Produk ditemukan', product);
})

// 14
app.get('/api/products/search', (req: Request, res: Response) => {
    const { name, max_price } = req.query

    let result = products

    if (name) {
        result = result.filter(p => p.nama.toLowerCase().includes((name as string).toLowerCase()))
    }

    if (max_price) {
        result = result.filter(p => p.harga <= Number(max_price))
    }

    successResponse(res, 'Produk ditemukan', result);
})

// 15
app.post('/api/products', validate(createProductValidation), (req: Request, res: Response) => {
    const { nama, deskripsi, harga } = req.body

    const newProduct = {
        id: products.length + 1,
        nama,
        deskripsi,
        harga: Number(harga)
    }

    products.push(newProduct)

    successResponse(res, 'Produk berhasil ditambahkan', newProduct, null, 201);
})

// 16
app.put('/api/products/:id', validate(updateProductValidation), (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    products[index] = { ...products[index], ...req.body }

    successResponse(res, 'Produk berhasil diupdate', products[index]);
})

// 17
app.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    const deleted = products.splice(index, 1)

    successResponse(res, 'Produk berhasil dihapus', deleted[0]);
})

// 18
const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

// 19
app.get('/api/test-async', asyncHandler(async (_req: Request, res: Response) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    successResponse(res, "Async berhasil!");
}));

// 20
app.use((req: Request, _res: Response) => {
    throw new Error(`Route ${req.originalUrl} tidak ditemukan`);
})

// 21
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[ERROR]", err.message)

    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 500

    errorResponse(
        res,
        err.message || "Terjadi kesalahan server",
        statusCode,
        process.env.NODE_ENV === "development" ? { stack: err.stack as string } : null
    )
})

app.listen(PORT, () => {
    console.log(`Server jalan → http://localhost:${PORT}`);
    console.log(`Coba buka semua route di atas pakai Postman!`);
})