import { FacebookAuthentication } from "@/domain/feature"
import { badRequest, HttpResponse, serverError, unauthorized, ok } from "@/application/helpers"
import { AccessToken } from "@/domain/models"
import { RequiredStringValidator, ValidationComposite, ValidationBuider } from "../validation"

type HttpRequest = {
    token: string
}

type Model = Error | {
    accessToken: string
}

export class FacebookLoginController {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) { }
    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        try {
            const error = this.validate(httpRequest);
            if (error !== undefined) {
                return badRequest(error)
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

    private validate(httpRequest: HttpRequest): Error | undefined {
        const validators = ValidationBuider
        .of({ value: httpRequest.token, fieldName: 'token'})
        .required()
        .build()
        return new ValidationComposite(validators).validate()
    }
}