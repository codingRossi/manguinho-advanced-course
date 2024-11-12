import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"
import { AccessToken } from "@/domain/models"
import { MockProxy, mock } from "jest-mock-extended"
import { FacebookLoginController } from "@/application/controllers"
import { ServerError, UnauthorizedError } from "@/application/errors"

describe('FaccebookLoginController', () => {
    let sut: FacebookLoginController
    let facebookAuth: MockProxy<FacebookAuthentication>

    beforeEach(() => {
        facebookAuth = mock()
        sut = new FacebookLoginController(facebookAuth)
        facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
    })

    it('Should return 400 if token is empty', async () => {
        const httpResponse = await sut.handle({ token: '' })
        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('Should return 400 if token is null', async () => {
        const httpResponse = await sut.handle({ token: null as any })
        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('Should return 400 if token is undefined', async () => {
        const httpResponse = await sut.handle({ token: undefined as any })
        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('Should call FacebookAlthentication with correct params', async () => {
        await sut.handle({ token: 'any_token' })
        expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' })
        expect(facebookAuth.perform).toHaveBeenCalledTimes(1)
    })

    it('Should return 401 if authentication fails', async () => {
        facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError())
        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new UnauthorizedError()
        })
    })

    it('Should return 200 if authentication succeed', async () => {
        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: 'any_value'
            }
        })
    })

    it('Should return 500 if authentication throws', async () => {
        const error = new Error('infra erro')
        facebookAuth.perform.mockRejectedValueOnce(error)
        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error)
        })
    })
})
