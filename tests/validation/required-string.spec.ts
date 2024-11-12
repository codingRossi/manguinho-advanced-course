import { RequiredeFieldError } from "@/application/errors"
import { RequiredStringValidator } from "@/application/validation"



describe('RequiredStringValidator', () => {

    it('Should return Error if value is empty', () => {
        const sut = new RequiredStringValidator('', 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredeFieldError('any_field'))
    })

    it('Should return Error if value is null', () => {
        const sut = new RequiredStringValidator(null as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredeFieldError('any_field'))
    })

    it('Should return Error if value is undefined', () => {
        const sut = new RequiredStringValidator(undefined as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredeFieldError('any_field'))
    })

    it('Should return undefined if value is not empty', () => {
        const sut = new RequiredStringValidator('any_value', 'any_field')

        const error = sut.validate()

        expect(error).toBeUndefined()
    })
})
