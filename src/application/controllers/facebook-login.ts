import { FacebookAuthentication } from "@/domain/feature"
import { badRequest, HttpResponse, serverError, unauthorized } from "@/application/helpers"
import { AccessToken } from "@/domain/models"
import { RequiredeFieldError } from "../errors"

export class FacebookLoginController {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
    async handle(httpRequest: any): Promise<HttpResponse> {
        try {
            if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
                return badRequest(new RequiredeFieldError('token'))
            }
            const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
            if (accessToken instanceof AccessToken) {
                return {
                    statusCode: 200,
                    data: {
                        accessToken: accessToken.value
                    }
                }
            } else {
                return unauthorized()
            }
        } catch (error) {
            return serverError(error as Error)
        }
    }
}