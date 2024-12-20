export class ServerError extends Error {
    constructor(error?: Error) {
        super('Server failed. Try again soon')
        this.name = 'ServerError'
        this.stack = error?.stack
    }
}

export class RequiredeFieldError extends Error {
    constructor(fieldName: string) {
        super('The field token is required')
        this.name = "RequiredFieldError"
    }
}

export class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized')
        this.name = "UnauthorizedError"
    }
}