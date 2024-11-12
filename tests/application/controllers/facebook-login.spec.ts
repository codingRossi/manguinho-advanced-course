import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"
import { AccessToken } from "@/domain/models"
import { MockProxy, mock } from "jest-mock-extended"
import { FacebookLoginController } from "@/application/controllers"
import { ServerError, UnauthorizedError } from "@/application/errors"
import { RequiredStringValidator } from "@/application/validation"

jest.mock('@/application/validation/required-string')

describe('FaccebookLoginController', () => {
    let sut: FacebookLoginController
    let facebookAuth: MockProxy<FacebookAuthentication>
    let token: string

    beforeEach(() => {
        token = 'any_token'
        facebookAuth = mock()
        sut = new FacebookLoginController(facebookAuth)
        facebookAuth.perform.mockResolvedValue(new AccessToken(token));
    })

    // it('Should return 400 if validation fails', async () => {
    //     const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any'}))
    //     mocked(RequiredStringValidator).mockImplementation(FacebookAccountStub)
    //     const httpResponse = await sut.handle({ token: token })

    //     expect(httpResponse).toEqual({
    //         statusCode: 400,
    //         data: new Error('token')
    //     })
    // })

    it('Should call FacebookAlthentication with correct params', async () => {
        await sut.handle({ token: 'any_token' })
        expect(facebookAuth.perform).toHaveBeenCalledWith({ token: token })
        expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
    })

    it('Should return 401 if authentication fails', async () => {
        facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
        const httpResponse = await sut.handle({ token: token })

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new UnauthorizedError()
        })
    })

    it('Should return 200 if authentication succeed', async () => {
        const httpResponse = await sut.handle({ token: token })

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: token
            }
        })
    })

    it('Should return 500 if authentication throws', async () => {
        const error = new Error('infra erro')
        facebookAuth.perform.mockRejectedValueOnce(error)
        const httpResponse = await sut.handle({ token: token })

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error)
        })
    })
})
