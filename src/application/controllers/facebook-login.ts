import { FacebookAuthentication } from "@/domain/feature"
import { badRequest, HttpResponse } from "@/application/helpers"
import { AccessToken } from "@/domain/models"
import { RequiredeFieldError, ServerError } from "../errors"

export class FacebookLoginController {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
    async handle(httpRequest: any): Promise<HttpResponse> {
        try {
            if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
                return badRequest(new RequiredeFieldError('token'))
            }
            const result = await this.facebookAuthentication.perform({ token: httpRequest.token })
            if (result instanceof AccessToken) {
                return {
                    statusCode: 200,
                    data: {
                        accessToken: result.value
                    }
                }
            } else {
                return {
                    statusCode: 401,
                    data: result
                }
            }
        } catch (error) {
            return {
                statusCode: 500,
                data: new ServerError(/**error*/)
            }
        }
    }
}