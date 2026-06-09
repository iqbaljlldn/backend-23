import request from "supertest"
import app from "../app"
import jwt from "jsonwebtoken"

describe("GET /api/products", () => {
    const token = jwt.sign({ id: 1, role: "USER" }, process.env.JWT_SECRET || "secret_kunci_rahasia")

    it('should return 401 if no token provided', async () => {
        const res = await request(app).get('/api/products')

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
    })

    it('should return 200 and list of products', async () => {
        const res = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    it('should return 200 and product by id', async () => {
        const res = await request(app).get('/api/products/1').set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(res.body.data).toHaveProperty('id')
    })
})