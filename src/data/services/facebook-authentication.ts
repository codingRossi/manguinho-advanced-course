import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"

export class FacebookAuthenticationService {
    constructor(
        private readonly LoadFacebookUserApi: LoadFacebookUserApi
    ) {}
    async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
        await this.LoadFacebookUserApi.loadUser(params)
        return new AuthenticationError()
    }
}