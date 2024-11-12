import { RequiredStringValidator, Validator } from "@/application/validation"


export class ValidationBuider {
    private constructor (
        private readonly value: string,
        private readonly fieldName: string,
        private readonly validators: Validator[] = []
    ) {}

    static of (params: { value: string; fieldName: string }): ValidationBuider {
        return new ValidationBuider(params.value, params.fieldName)
    }

    required (): ValidationBuider {
        this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
        return this
    }

    build (): Validator[] {
        return this.validators
    }
}
