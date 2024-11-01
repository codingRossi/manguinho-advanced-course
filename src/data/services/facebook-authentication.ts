import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccontRepository, createFacebookAccountRepository } from "@/data/contracts/repos"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"


export class FacebookAuthenticationService {
    constructor(
        private readonly LoadFacebookUserApi: LoadFacebookUserApi,
        private readonly loadUserAccountRepo: LoadUserAccontRepository,
        private readonly createFacebookAccountRepo: createFacebookAccountRepository

    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
        const fbData = await this.LoadFacebookUserApi.loadUser(params)
        if ( fbData !== undefined ) {
        await this.loadUserAccountRepo.load({ email: fbData?.email})
        await this.createFacebookAccountRepo.createFromFacebook(fbData)
        }
        return new AuthenticationError()
    }
}