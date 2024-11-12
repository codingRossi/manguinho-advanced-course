import { RequiredStringValidator, Validator } from "@/application/validation"
import { ValidationBuider } from "@/application/validation"

describe('ValidationBuider', () => {
    it('Should return a RequiredStringValidator', () => {
        const validators = ValidationBuider
            .of({ value: 'any_value', fieldName: 'any_name' })
            .required()
            .build()

            expect(validators).toEqual([ new RequiredStringValidator('any_value', 'any_name')])
    })
})
