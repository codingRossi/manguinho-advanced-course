import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccontRepository } from "@/data/contracts/repos"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"

export class FacebookAuthenticationService {
    constructor(
        private readonly LoadFacebookUserApi: LoadFacebookUserApi,
        private readonly loadUserAccountRepo: LoadUserAccontRepository
    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
        const fbData = await this.LoadFacebookUserApi.loadUser(params)
        if ( fbData !== undefined ) {
        await this.loadUserAccountRepo.load({ email: fbData?.email})
        }
        return new AuthenticationError()
    }
}