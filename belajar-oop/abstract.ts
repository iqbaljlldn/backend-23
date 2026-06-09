abstract class Shape {
    abstract hitungLuas(): number
    abstract hitungKeliling(): number

    deskripsi(): string {
        return `Luas: ${this.hitungLuas()}, Keliling: ${this.hitungKeliling()}`
    }
}

abstract class abcd { }

class Lingkaran extends Shape {
    constructor(private radius: number) {
        super()
    }

    hitungLuas(): number {
        return Math.PI * this.radius ** 2
    }

    hitungKeliling(): number {
        return 2 * Math.PI * this.radius
    }
}

class PersegiPanjang extends Shape {
    constructor(private panjang: number, private lebar: number) {
        super()
    }

    hitungLuas(): number {
        return this.panjang * this.lebar
    }

    hitungKeliling(): number {
        return 2 * (this.panjang + this.lebar)
    }
}

const lingkaran = new Lingkaran(7)
const persegi = new PersegiPanjang(5, 10)

console.log(lingkaran.deskripsi())
console.log(persegi.deskripsi())