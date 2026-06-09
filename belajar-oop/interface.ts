interface IUser {
    id: number
    name: string
    email: string
    getFullInfo(): string
}

interface IAuthenticable {
    login(password: string): boolean
    logout(): void
}

class User implements IUser, IAuthenticable {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        private password: string
    ) { }

    getFullInfo(): string {
        return `${this.name} - ${this.email}`
    }

    login(password: string): boolean {
        return this.password === password
    }

    logout(): void {
        console.log(`${this.name} telah logout`)
    }
}

const user = new User(1, "Iqbal", "[EMAIL_ADDRESS]", "123456")
console.log(user.getFullInfo())
console.log(user.login("123456"))
user.logout()