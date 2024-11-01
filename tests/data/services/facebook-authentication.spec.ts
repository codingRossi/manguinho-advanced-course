import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { FacebookAuthenticationService } from "@/data/services"; 

class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
    token?: string
    result = undefined
    callsCount = 0

    async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
        this.token = params.token;
        this.callsCount++
        return this.result
    }
}
    describe('FacebookAuthenticationService', () => {
        it('Should call LoadFacebookUserApi with correct params', async () => {
            const LoadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            await sut.perform({ token: 'any_token' })
            expect(LoadFacebookUserApi.token).toBe('any_token')
            expect(LoadFacebookUserApi.callsCount).toBe(1)
        })

        it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
            const LoadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
            LoadFacebookUserApi.result = undefined
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            const authResult = await sut.perform({ token: 'any_token' })
            expect(authResult).toEqual(new AuthenticationError())
        })
    })
