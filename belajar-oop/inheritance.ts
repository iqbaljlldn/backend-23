class Kendaraan {
    protected merk: string
    protected tahun: number

    constructor(merk: string, tahun: number) {
        this.merk = merk
        this.tahun = tahun
    }

    info(): string {
        return `${this.merk} tahun ${this.tahun}`
    }

    jalan(): void {
        console.log(`${this.merk} sedang berjalan`)
    }
}

class Motor extends Kendaraan {
    private jenisMotor: string

    constructor(merk: string, tahun: number, jenisMotor: string) {
        super(merk, tahun)
        this.jenisMotor = jenisMotor
    }

    info(): string {
        return `${super.info()} - Jenis: ${this.jenisMotor}`
    }

    wheelie(): void {
        console.log(`${this.merk} sedang melakukan wheelie`)
    }
}

const motor = new Motor("Yamaha", 2023, "Sport")
console.log(motor.info())
motor.jalan()
motor.wheelie()