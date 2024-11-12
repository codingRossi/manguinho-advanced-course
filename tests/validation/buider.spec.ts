import { RequiredStringValidator, Validator } from "@/application/validation"

class ValidationBuider {
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

describe('ValidationBuider', () => {
    it('Should return a RequiredStringValidator', () => {
        const validators = ValidationBuider
            .of({ value: 'any_value', fieldName: 'any_name' })
            .required()
            .build()

            expect(validators).toEqual([ new RequiredStringValidator('any_value', 'any_name')])
    })
})
