class Mobil {
    merk: string
    warna: string
    tahun: number

    constructor(merk: string, warna: string, tahun: number) {
        this.merk = merk
        this.warna = warna
        this.tahun = tahun
    }

    jalan() {
        console.log(`${this.merk} berwarna ${this.warna} sedang berjalan...`)
    }

    deskripsi() {
        return `${this.merk} ${this.warna} tahun ${this.tahun}`
    }
}

const avanza = new Mobil('Toyota Avanza', 'Hitam', 2023)
const brio = new Mobil('Honda Brio', 'Putih', 2024)

avanza.jalan()
avanza.deskripsi()
console.log(brio.deskripsi())