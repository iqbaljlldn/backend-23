class AkunBank {
    private saldo: number
    public pemilik: string
    protected nomorRekening: string

    constructor(pemilik: string, nomorRekening: string, saldo: number) {
        this.saldo = saldo
        this.pemilik = pemilik
        this.nomorRekening = nomorRekening
    }

    cekSaldo(): number {
        return this.saldo
    }

    deposit(jumlah: number): void {
        if (jumlah <= 0) throw new Error("Jumlah deposit harus lebih dari 0")

        this.saldo += jumlah
    }

    tarik(jumlah: number): void {
        if (jumlah > this.saldo) throw new Error("Saldo tidak cukup")
        if (jumlah <= 0) throw new Error("Jumlah tarik harus lebih dari 0")

        this.saldo -= jumlah
    }
}

const akun = new AkunBank("Iqbal", "123456789", 50000)
console.log("pemilik: ", akun.pemilik)
console.log("saldo: ", akun.cekSaldo())
// console.log("saldo: ", akun.saldo)
// console.log("nomor rekening: ", akun.nomorRekening)

akun.deposit(10000)
console.log("saldo: ", akun.cekSaldo())
akun.tarik(15000)
console.log("saldo: ", akun.cekSaldo())