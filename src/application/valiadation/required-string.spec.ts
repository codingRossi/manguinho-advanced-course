import { RequiredeFieldError } from "@/application/errors"

class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}
  validate (): Error | undefined {
    return new RequiredeFieldError('any_field')
  }
}

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
})
