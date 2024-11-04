import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { HttpGetClient } from "../http"

export class FacebookApi {
    private readonly basicUrl = 'https://graph.facebook.com'
    constructor(
        private readonly httpClient: HttpGetClient,
        private readonly clientId: string,
        private readonly clientSecret: string
    ) { }
    async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
        await this.httpClient.get({
            url: `${this.basicUrl}/oauth/access_token`,
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            }
        })
    }
}