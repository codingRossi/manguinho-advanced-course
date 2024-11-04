import { FacebookApi } from "@/infra/apis"
import { HttpGetClient } from "@/infra/http"
import { mock, MockProxy } from "jest-mock-extended"



describe('FacebookApi', () => {
    let clientId: string
    let clientSecret: string
    let sut: FacebookApi
    let httpClient: MockProxy<HttpGetClient>

    beforeAll(() => {
        httpClient = mock()
        clientId = 'any_client_id'
        clientSecret = 'any_client_secret'
    })

    beforeEach(() => {
        const sut = new FacebookApi(httpClient, clientId, clientSecret)
    })

    it('Should get app token', async () => {

        const sut = new FacebookApi(httpClient, clientId, clientSecret)

        await sut.loadUser({ token: 'any_client_token' })
        expect(httpClient.get).toHaveBeenCalledWith({
            url: 'https://graph.facebook.com/oauth/access_token',
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            }
        })
    })
})
