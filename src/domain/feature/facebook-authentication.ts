import { AccessToken } from "@/domain/models"
import { AuthenticationError } from "@/domain/errors"

export interface FacebookAuthentication {
    perform: (token: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

namespace FacebookAuthentication {
    export type Params = {
        token: string
    }

export type Result =  AccessToken | AuthenticationError
}

