import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccontRepository, CreateFacebookAccountRepository } from "@/data/contracts/repos"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"


export class FacebookAuthenticationService {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccontRepository & CreateFacebookAccountRepository,

    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
        const fbData = await this.facebookApi.loadUser(params)
        if ( fbData !== undefined ) {
        await this.userAccountRepo.load({ email: fbData?.email})
        await this.userAccountRepo.createFromFacebook(fbData)
        }
        return new AuthenticationError()
    }
}