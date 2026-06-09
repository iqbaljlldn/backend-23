export interface IProduct {
    id?: number;
    name?: string;
    price?: number;
    stock?: number;
    createdAt?: Date;
}

export interface ICreateProduct {
    name: string;
    price: number;
    stock: number;
}

export interface IUpdateProduct {
    name?: string;
    price?: number;
    stock?: number;
}