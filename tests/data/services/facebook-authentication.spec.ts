import { FacebookAuthentication } from "@/domain/feature";

class FacebookAuthenticationService {
    constructor(
        private readonly LoadFacebookUserApi: LoadFacebookUserApi
    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<void> {
        await this.LoadFacebookUserApi.loadUser(params)
    }
}

interface LoadFacebookUserApi {
    loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
    export type Params = {
        token: string
    }
}

class LoadFacebookUserByTokenApiSpy implements LoadFacebookUserApi {
    token?: string
    async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
        this.token = params.token;
    }
}
    describe('FacebookAuthenticationService', () => {
        it('Should call LoadFacebookUserApi with correct params', async () => {
            const LoadFacebookUserApi = new LoadFacebookUserByTokenApiSpy()
            const sut = new FacebookAuthenticationService(LoadFacebookUserApi)

            await sut.perform({ token: 'any_token' })
            expect(LoadFacebookUserApi.token).toBe('any_token')
        })
    })
