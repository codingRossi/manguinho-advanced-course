import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/feature";

class FacebookAuthenticationService {
    constructor(
        private readonly LoadFacebookUserApi: LoadFacebookUserApi
    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
        await this.LoadFacebookUserApi.loadUser(params)
        return new AuthenticationError()
    }
}

interface LoadFacebookUserApi {
    loadUser: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

namespace LoadFacebookUserApi {
    export type Params = {
        token: string
    }

    export type Result = undefined
}

class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
    token?: string
    result = undefined

    async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
        this.token = params.token;
        return this.result
    }
}
    describe('FacebookAuthenticationService', () => {
        it('Should call LoadFacebookUserApi with correct params', async () => {
            const LoadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            await sut.perform({ token: 'any_token' })
            expect(LoadFacebookUserApi.token).toBe('any_token')
        })

        it('Should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
            const LoadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
            LoadFacebookUserApi.result = undefined
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            const authResult = await sut.perform({ token: 'any_token' })
            expect(authResult).toEqual(new AuthenticationError())
        })
    })
