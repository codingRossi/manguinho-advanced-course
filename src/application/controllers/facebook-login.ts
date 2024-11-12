import { FacebookAuthentication } from "@/domain/feature"
import { badRequest, HttpResponse, serverError, unauthorized, ok } from "@/application/helpers"
import { AccessToken } from "@/domain/models"
import { RequiredeFieldError } from "../errors"

type HttpRequest = {
    token: string | undefined | null
}

type Model = Error | {
    accessToken: string
}

export class FacebookLoginController {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        try {
            if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
                return badRequest(new RequiredeFieldError('token'))
            }
            const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
            if (accessToken instanceof AccessToken) {
                return ok({
                    accessToken: accessToken.value
                })
            } else {
                return unauthorized()
            }
        } catch (error) {
            return serverError(error as Error)
        }
    }
}