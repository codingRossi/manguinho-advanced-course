import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccontRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/feature"
import { AccessToken, FacebookAccount } from "@/domain/models"
import { TokenGenerator } from "@/data/contracts/crypto";



export class FacebookAuthenticationService implements FacebookAuthentication{
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccontRepository & SaveFacebookAccountRepository,
        private readonly crypto: TokenGenerator

    ) { }
    async perform(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
        const fbData = await this.facebookApi.loadUser(params)
        if (fbData !== undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            const fbAccount = new FacebookAccount(fbData, accountData)
            const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
            const token = await this.crypto.generateToken({key: id, expirationInMs: AccessToken.expirationInMs})
            return new AccessToken(token)
        }
        return new AuthenticationError()
    }
}

